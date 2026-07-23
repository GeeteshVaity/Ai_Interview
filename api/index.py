import os
import json
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fitz  # PyMuPDF
from groq import Groq
from dotenv import load_dotenv

# 1. Load environment variables (Vercel will inject them from project settings)
load_dotenv()

api_key = os.environ.get("GROQ_API_KEY")
if not api_key or api_key == "your_groq_api_key_here":
    print("⚠️ WARNING: GROQ_API_KEY is missing or still the placeholder!")
else:
    print(f"✅ GROQ_API_KEY loaded (starts with: {api_key[:8]}...)")

# 2. Create FastAPI app + CORS
app = FastAPI(title="InterviewAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Initialize the Groq AI client
client = Groq(api_key=api_key)


class AnalyzeRequest(BaseModel):
    text: str


@app.get("/")
def health_check():
    return {"status": "ok", "message": "InterviewAI backend is running!"}


@app.post("/api/upload")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    content = await file.read()
    try:
        doc = fitz.open(stream=content, filetype="pdf")
        resume_text = ""
        for page in doc:
            resume_text += page.get_text()
        num_pages = len(doc)
        doc.close()
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read the PDF file.")

    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="The PDF appears to be empty or image-only.")

    return {
        "filename": file.filename,
        "pages": num_pages,
        "text": resume_text.strip()
    }


@app.post("/api/analyze")
async def analyze_resume(body: AnalyzeRequest):
    if not body.text.strip():
        raise HTTPException(status_code=400, detail="Resume text is empty.")

    prompt = f"""You are an expert ATS (Applicant Tracking System) resume parser.
Analyze the following resume text and extract the information into a JSON object with these exact keys:

- "skills": a list of skill strings (e.g. ["Python", "React", "Docker"])
- "projects": a list of objects, each with "name" (string) and "description" (string)
- "education": a list of objects, each with "degree" (string), "institution" (string), and "year" (string)
- "experience": a list of objects, each with "title" (string), "company" (string), "duration" (string), and "description" (string)

If a section is not found in the resume, return an empty list for that key.
Return ONLY the JSON object, nothing else.

Resume Text:
{body.text}"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Groq API error: {str(e)}")

    ai_response = chat_completion.choices[0].message.content
    try:
        parsed_data = json.loads(ai_response)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON. Please try again.")

    return parsed_data
