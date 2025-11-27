# Python

SECRET_KEY = "7p+fNv/LbLpvafsoDPo8e+UG3XAvn43Pkb5MjwwRR9pi3Acdskl/V57F"

# Custom branding
APP_NAME = "Smart Applications"
SHOW_APP_NAME = False
LOGO_TARGET_PATH = "/"

# Import required modules
import os

# Add plugins directory to Python path
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'plugins'))

# Frontend plugin configuration
FEATURE_FLAGS = {
    "ENABLE_TEMPLATE_PROCESSING": True,
}

# Add custom static assets
ADDITIONAL_STATIC_FOLDERS = [
    os.path.join(os.path.dirname(__file__), 'static'),
]

# Development mode - allow custom plugins
TALISMAN_ENABLED = False

print("Superset configuration updated for chatbot plugin")

# Force custom navbar
APP_DIR = '/app'
CUSTOM_TEMPLATE_PATHS = ['/app/superset_home/templates']
