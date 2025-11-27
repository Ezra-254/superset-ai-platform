from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import pymysql
import os
from pydantic import BaseModel
import json
import re

app = FastAPI(title="Superset Gemini AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === CONFIG ===
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("Please set GEMINI_API_KEY in environment")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

MYSQL_HOST = os.getenv("MYSQL_HOST", "host.docker.internal")
MYSQL_USER = os.getenv("MYSQL_USER", "MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "MSQL_PASSWORD")
MYSQL_DB = os.getenv("MYSQL_DB", "MYSQL_DB")

# ——— DYNAMIC SCHEMA LOADER ———
try:
    conn = pymysql.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB
    )
    cur = conn.cursor()
    cur.execute("SHOW COLUMNS FROM MYSQL TABLE")
    cols = cur.fetchall()
    schema_lines = [f"  • {col[0]} ({col[1]})" for col in cols]
    DYNAMIC_SCHEMA = "\n".join(schema_lines)
    conn.close()
except Exception as e:
    DYNAMIC_SCHEMA = f"ERROR loading schema: {e}"

with open("schema_hint.txt", "r") as f:
    SCHEMA_HINT = f.read().replace("{{DYNAMIC_SCHEMA}}", DYNAMIC_SCHEMA)

class Question(BaseModel):
    question: str

def run_sql(sql: str):
    try:
        conn = pymysql.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DB,
            cursorclass=pymysql.cursors.DictCursor
        )
        with conn.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()
            columns = [desc[0] for desc in cur.description] if cur.description else []
        conn.close()
        return {"success": True, "columns": columns, "rows": rows[:100]}
    except Exception as e:
        return {"success": False, "error": str(e)}

def force_line_breaks(text: str) -> str:
    """Force proper line breaks for numbered lists and adjust title dynamically"""
    # Match numbered items: "1. Item: 7,470" or "1 Item: 7,470"
    pattern = r'(\d+)[\.\s]+([^\d]+?:\s*[\d,]+)'
    matches = re.findall(pattern, text)
    
    if matches:
        count = len(matches)
        title = f"Top {count} Diagnoses:"
        formatted_lines = [title]
        for number, item in matches:
            # Remove trailing 'cases' if present
            item = re.sub(r'\s*cases?$', '', item, flags=re.IGNORECASE)
            formatted_lines.append(f"{number}. {item.strip()}")
        return "\n".join(formatted_lines)
    
    return text

def format_with_kes(text: str) -> str:
    """Format any monetary amounts with KES currency - FIXED MULTIPLE KES ISSUE"""
    
    if 'KES' in text:
        kes_pattern = r'KES\s*([\d,]+\.?\d*)'
        matches = re.finditer(kes_pattern, text)
        for match in matches:
            amount_str = match.group(1)
            clean_amount = amount_str.replace(',', '').strip()
            try:
                amount = float(clean_amount)
                properly_formatted = f"{amount:,.2f}"
                text = text.replace(amount_str, properly_formatted)
            except ValueError:
                continue
        return text
    
    patterns = [
        r'(revenue|amount|total|sum).*?(\d[\d,]*\.?\d*)',  
        r'\$(\d[\d,]*\.?\d*)',                             
    ]
    
    formatted_text = text
    already_formatted = False
    
    for pattern in patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            if already_formatted:
                continue
            amount_str = match.group(2) if len(match.groups()) > 1 else match.group(1)
            clean_amount = amount_str.replace(',', '').strip()
            try:
                amount = float(clean_amount)
                if amount > 1000:  
                    kes_formatted = f"KES {amount:,.2f}"
                    if len(match.groups()) > 1:
                        original_phrase = match.group(0)
                        new_phrase = original_phrase.replace(amount_str, kes_formatted)
                        formatted_text = formatted_text.replace(original_phrase, new_phrase, 1)
                    else:
                        formatted_text = formatted_text.replace(amount_str, kes_formatted, 1)
                    already_formatted = True
                    break
            except ValueError:
                continue
    
    if not already_formatted:
        large_number_pattern = r'(\d{6,}\.?\d*)'  
        match = re.search(large_number_pattern, formatted_text)
        if match:
            amount_str = match.group(1)
            try:
                amount = float(amount_str.replace(',', ''))
                if amount > 100000:  
                    kes_formatted = f"KES {amount:,.2f}"
                    formatted_text = formatted_text.replace(amount_str, kes_formatted, 1)
            except ValueError:
                pass
    
    if not already_formatted and '$' in formatted_text:
        formatted_text = formatted_text.replace('$', 'KES ')
    
    return formatted_text

def clean_response(text: str) -> str:
    """Remove unwanted phrases and format the response"""
    
    text = re.sub(r'from the first 100 records', '', text, flags=re.IGNORECASE)
    text = re.sub(r'first 100 records', '', text, flags=re.IGNORECASE)
    text = re.sub(r'LIMIT 100', '', text, flags=re.IGNORECASE)
    
    text = re.sub(r'Want me to create a chart for this\?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Want me to create a chart\?', '', text, flags=re.IGNORECASE)
    
    text = re.sub(r'It looks like your query.*?table\.', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Your query included.*?clause\.', '', text, flags=re.IGNORECASE)
    
    text = force_line_breaks(text)
    
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    
    return text

@app.get("/")
async def root():
    return {"message": "Gemini AI service is running!"}

@app.post("/ask")
async def ask(q: Question):
    prompt = f"""You are an expert MySQL analyst for database `{MYSQL_DB}`.

{SCHEMA_HINT}

Generate ONLY a valid MySQL SELECT query using the exact columns above.
Never use any other table. Never invent JOINs.

User question: {q.question}

Rules:
- ALWAYS add LIMIT 100
- Return ONLY the raw SQL query
- NO markdown, NO ```sql
- The very first character must be S from SELECT
- If you add anything else, the system will crash"""

    try:
        response = model.generate_content(prompt)
        sql = response.text.strip().strip("`").strip()

        if not sql.lower().startswith("select"):
            return {"error": "Only SELECT queries allowed", "raw_sql": sql}

        result = run_sql(sql)
        if not result["success"]:
            return {"error": result["error"], "sql": sql}

        explain_prompt = f"""Question: {q.question}
Data: {json.dumps(result["rows"], default=str)}

Format your answer EXACTLY as shown below:

FOR LISTS (like top diagnoses, rankings, etc.):
Top Diagnoses:
1. Dental caries: 7,470 cases
2. Essential hypertension: 5,124 cases  
3. Acute upper respiratory infection: 3,928 cases
[continue with each item on a new line]

FOR SINGLE VALUES (like totals, counts, etc.):
Total revenue: KES 666,870

RULES:
- Each numbered item MUST be on its own line
- Use proper spacing after numbers (1. not 1.)
- Never mention "first 100 records" or SQL details
- Never suggest charts
- Use comma formatting for large numbers (7,470 not 7470)
- For revenue/amount values, include KES prefix ONLY ONCE
- Be direct and factual"""

        explanation = model.generate_content(explain_prompt).text
        
        cleaned_answer = clean_response(explanation.strip())
        final_answer = format_with_kes(cleaned_answer)

        return {
            "answer": final_answer,
            "sql": sql,
            "data": result
        }

    except Exception as e:
        return {"error": str(e)}
