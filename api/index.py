import sys
from pathlib import Path

# Add the backend directory to Python's system path so it can import main.py
backend_path = Path(__file__).resolve().parent.parent / "backend"
sys.path.append(str(backend_path))

# Import the FastAPI app instance from backend/main.py
# pyrefly: ignore [missing-import]
from main import app
