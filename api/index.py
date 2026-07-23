import sys
import os

# Add the project root (one level up from api) to the sys.path
# This ensures that "from backend.main import x" works
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from backend.main import app
