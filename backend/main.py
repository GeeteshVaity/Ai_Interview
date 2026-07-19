"""
backend/main.py — InterviewAI Backend
──────────────────────────────────────
Task 1: POST /upload   → receives PDF, extracts text via PyMuPDF
Task 2: POST /analyze  → sends extracted text to Groq AI, returns structured JSON
"""

import os
import json
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fitz  # PyMuPDF — reads PDF files
from groq import Groq
from dotenv import load_dotenv

# ──────────────────────────────────────────────
# 1. Load environment variables from .env
# ──────────────────────────────────────────────
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.environ.get("GROQ_API_KEY")
if not api_key or api_key == "your_groq_api_key_here":
    print("⚠️  WARNING: GROQ_API_KEY is missing or still the placeholder!")
else:
    print(f"✅ GROQ_API_KEY loaded (starts with: {api_key[:8]}...)")

# ──────────────────────────────────────────────
# 2. Create FastAPI app + CORS
# ──────────────────────────────────────────────
app = FastAPI(title="InterviewAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # Allow frontend on any port (dev only)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# 3. Initialize the Groq AI client
# ──────────────────────────────────────────────
client = Groq(api_key=api_key)


# ──────────────────────────────────────────────
# Request body model for /analyze
# ──────────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    """The frontend sends the extracted resume text in this format."""
    text: str


# ══════════════════════════════════════════════
# ROUTE: GET /
# Health check — verify the server is alive
# ══════════════════════════════════════════════
@app.get("/")
def health_check():
    return {"status": "ok", "message": "InterviewAI backend is running!"}


# ══════════════════════════════════════════════
# ROUTE: POST /upload  (Task 1)
# Receives a PDF file → extracts text → returns it
# ══════════════════════════════════════════════
@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Accepts a PDF resume and extracts all text using PyMuPDF.
    Returns: { filename, pages, text }
    """

    # Validate file type
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    # Read and extract text
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

    print(f"✅ /upload — Extracted {len(resume_text)} chars from {num_pages} page(s)")
    return {
        "filename": file.filename,
        "pages": num_pages,
        "text": resume_text.strip()
    }


# ══════════════════════════════════════════════
# ROUTE: POST /analyze  (Task 2)
# Takes extracted resume text → sends to Groq AI
# → returns structured JSON with skills, projects,
#   education, and experience
# ══════════════════════════════════════════════
@app.post("/analyze")
async def analyze_resume(body: AnalyzeRequest):
    """
    Sends the resume text to Groq's Llama 3.3 model for
    ATS-style parsing. Returns structured JSON.

    Request body:  { "text": "John Doe ... Software Engineer ..." }
    Response:      { "skills": [...], "projects": [...], ... }
    """

    # ── Step 1: Validate the input ──
    if not body.text.strip():
        raise HTTPException(status_code=400, detail="Resume text is empty.")

    # ── Step 2: Build the prompt for the AI ──
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

    # ── Step 3: Call the Groq API ──
    print("🤖 Sending resume to Groq AI for analysis...")
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},  # Forces valid JSON output
        )
    except Exception as e:
        print(f"❌ Groq API error: {e}")
        raise HTTPException(status_code=502, detail=f"Groq API error: {str(e)}")

    # ── Step 4: Parse and return the AI response ──
    ai_response = chat_completion.choices[0].message.content

    try:
        parsed_data = json.loads(ai_response)
    except json.JSONDecodeError:
        print(f"❌ AI returned invalid JSON: {ai_response[:200]}")
        raise HTTPException(status_code=500, detail="AI returned invalid JSON. Please try again.")

    # Log a summary of what was found
    print(f"✅ /analyze — Found: "
          f"{len(parsed_data.get('skills', []))} skills, "
          f"{len(parsed_data.get('projects', []))} projects, "
          f"{len(parsed_data.get('education', []))} education entries, "
          f"{len(parsed_data.get('experience', []))} experience entries")

    return parsed_data


# ──────────────────────────────────────────────
# Request/response models for Interview routes
# ──────────────────────────────────────────────
class StartInterviewRequest(BaseModel):
    """Parsed resume data from the /analyze step."""
    skills: list = []
    projects: list = []
    education: list = []
    experience: list = []


class NextQuestionRequest(BaseModel):
    """User's answer + conversation history so far."""
    answer: str
    conversation: list  # list of { "role": "assistant" | "user", "content": str }
    resume_summary: str  # brief resume context for the AI
    question_number: int  # which question we're on (1-indexed)
    total_questions: int = 5


# ══════════════════════════════════════════════
# ROUTE: POST /start-interview  (Task 5)
# Takes parsed resume → generates first question
# ══════════════════════════════════════════════
@app.post("/start-interview")
async def start_interview(body: StartInterviewRequest):
    """
    Receives the parsed resume data and generates the first
    interview question tailored to the candidate's background.

    Returns: { "question": "...", "resume_summary": "..." }
    """

    # Build a concise summary of the resume for context
    resume_summary = f"""
Skills: {', '.join(body.skills[:15]) if body.skills else 'Not specified'}
Projects: {', '.join([p.get('name', '') if isinstance(p, dict) else str(p) for p in body.projects[:5]]) if body.projects else 'None listed'}
Education: {', '.join([e.get('degree', '') + ' from ' + e.get('institution', '') if isinstance(e, dict) else str(e) for e in body.education[:3]]) if body.education else 'Not specified'}
Experience: {', '.join([e.get('title', '') + ' at ' + e.get('company', '') if isinstance(e, dict) else str(e) for e in body.experience[:5]]) if body.experience else 'Not specified'}
""".strip()

    prompt = f"""You are Nova, a friendly but professional AI interviewer. You are conducting a behavioral and technical interview.

Here is the candidate's resume summary:
{resume_summary}

Generate your opening greeting and first interview question. The question should be:
- Personalized to their resume (reference a specific skill, project, or experience)
- Open-ended to encourage a detailed answer
- Professional but warm in tone

Return ONLY a JSON object with:
- "greeting": a brief warm greeting (1 sentence)
- "question": the first interview question

Example format:
{{"greeting": "Hi! Thanks for joining. I've reviewed your background and I'm excited to learn more.", "question": "I see you worked on X project using Y technology. Can you walk me through the biggest challenge you faced?"}}"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
        )
    except Exception as e:
        print(f"❌ Groq API error: {e}")
        raise HTTPException(status_code=502, detail=f"Groq API error: {str(e)}")

    ai_response = chat_completion.choices[0].message.content
    try:
        result = json.loads(ai_response)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON.")

    print(f"✅ /start-interview — First question generated")
    return {
        "greeting": result.get("greeting", "Welcome! Let's begin your interview."),
        "question": result.get("question", "Tell me about yourself and your experience."),
        "resume_summary": resume_summary
    }


# ══════════════════════════════════════════════
# ROUTE: POST /next-question  (Task 5)
# Takes user's answer + history → generates next Q
# ══════════════════════════════════════════════
@app.post("/next-question")
async def next_question(body: NextQuestionRequest):
    """
    Receives the user's answer and conversation history,
    generates a follow-up question or wraps up the interview.

    Returns: { "question": "...", "feedback": "..." }
    """

    if not body.answer.strip():
        raise HTTPException(status_code=400, detail="Answer cannot be empty.")

    is_last = body.question_number >= body.total_questions

    prompt = f"""You are Nova, a friendly but professional AI interviewer conducting question {body.question_number} of {body.total_questions}.

Candidate's resume summary:
{body.resume_summary}

The candidate just answered your previous question. Here is the conversation so far:
{json.dumps(body.conversation, indent=2)}

Their latest answer: "{body.answer}"

{"This is the LAST question. After your brief feedback, provide a warm closing remark thanking the candidate." if is_last else ""}

Return ONLY a JSON object with:
- "feedback": brief positive feedback on their answer (1-2 sentences, be encouraging)
- "question": {"a closing remark thanking them for their time (since this is the last question)" if is_last else "your next interview question (personalized, open-ended, different topic from previous questions)"}
- "is_complete": {"true" if is_last else "false"}"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
        )
    except Exception as e:
        print(f"❌ Groq API error: {e}")
        raise HTTPException(status_code=502, detail=f"Groq API error: {str(e)}")

    ai_response = chat_completion.choices[0].message.content
    try:
        result = json.loads(ai_response)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON.")

    print(f"✅ /next-question — Q{body.question_number}/{body.total_questions} "
          f"{'(final)' if is_last else ''}")

    return {
        "feedback": result.get("feedback", "Good answer!"),
        "question": result.get("question", ""),
        "is_complete": result.get("is_complete", is_last)
    }


# ──────────────────────────────────────────────
# Request model for /answer
# ──────────────────────────────────────────────
class AnswerRequest(BaseModel):
    """User's spoken/typed answer for evaluation."""
    answer: str
    current_question: str          # The question that was just answered
    conversation: list = []        # Full conversation history
    resume_summary: str = ""       # Resume context
    question_number: int = 1       # Current question number
    total_questions: int = 5       # Total planned questions


# ══════════════════════════════════════════════
# ROUTE: POST /answer  (Task 6)
# Evaluates the answer → 'satisfied' or 'follow_up'
# If satisfied: returns next new question
# If follow_up: returns a probing follow-up question
# ══════════════════════════════════════════════
@app.post("/answer")
async def evaluate_answer(body: AnswerRequest):
    """
    Evaluates the candidate's answer and decides:
    - 'satisfied': answer was thorough → move to next question
    - 'follow_up': answer was too brief/vague → ask a follow-up probe

    Returns: {
        verdict: 'satisfied' | 'follow_up',
        feedback: str,
        follow_up_question: str | null,    (if follow_up)
        next_question: str | null,         (if satisfied)
        is_complete: bool                  (true if interview is over)
    }
    """

    if not body.answer.strip():
        raise HTTPException(status_code=400, detail="Answer cannot be empty.")

    is_last = body.question_number >= body.total_questions

    prompt = f"""You are Nova, a professional AI interviewer conducting question {body.question_number} of {body.total_questions}.

Candidate's resume:
{body.resume_summary}

You just asked: "{body.current_question}"

The candidate answered: "{body.answer}"

Conversation so far:
{json.dumps(body.conversation[-10:], indent=2)}

EVALUATE the answer and decide:
1. If the answer is DETAILED, SPECIFIC, and THOROUGH (includes examples, metrics, or clear explanations) → verdict is "satisfied"
2. If the answer is TOO BRIEF, VAGUE, or SURFACE-LEVEL (one-liners, no examples, generic statements) → verdict is "follow_up"

Return ONLY a JSON object with these fields:
- "verdict": either "satisfied" or "follow_up"
- "feedback": 1-2 sentences of encouraging feedback on their answer
- "follow_up_question": if verdict is "follow_up", a probing question that digs deeper into the same topic (e.g. "Can you give a specific example?" or "What metrics showed the impact?"). Set to null if satisfied.
- "next_question": if verdict is "satisfied", {"a warm closing remark since this is the last question" if is_last else "a NEW interview question on a DIFFERENT topic"}. Set to null if follow_up.
- "is_complete": {str(is_last).lower()} (only true when satisfied AND it's the last question)"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
        )
    except Exception as e:
        print(f"❌ Groq API error: {e}")
        raise HTTPException(status_code=502, detail=f"Groq API error: {str(e)}")

    ai_response = chat_completion.choices[0].message.content
    try:
        result = json.loads(ai_response)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON.")

    verdict = result.get("verdict", "satisfied")
    print(f"✅ /answer — Q{body.question_number}: verdict={verdict} "
          f"{'(final)' if is_last and verdict == 'satisfied' else ''}")

    return {
        "verdict": verdict,
        "feedback": result.get("feedback", "Thanks for your answer!"),
        "follow_up_question": result.get("follow_up_question"),
        "next_question": result.get("next_question"),
        "is_complete": result.get("is_complete", False)
    }


# ──────────────────────────────────────────────
# Request model for /finish
# ──────────────────────────────────────────────
class FinishRequest(BaseModel):
    """Full interview transcript for final evaluation."""
    transcript: list  # list of { who: "AI" | "You", text: str }
    resume_summary: str = ""


# ══════════════════════════════════════════════
# ROUTE: POST /finish  (Task 7)
# Generates overall interview summary, scores,
# strengths, weaknesses, and improvements
# ══════════════════════════════════════════════
@app.post("/finish")
async def finish_interview(body: FinishRequest):
    """
    Takes the full interview transcript and generates a
    comprehensive evaluation with scores and feedback.

    Returns: {
        overall_score: int,
        clarity_score: int,
        structure_score: int,
        confidence_score: int,
        strengths: [str],
        weaknesses: [str],
        improvements: [str],
        summary: str,
        score_label: str
    }
    """

    if not body.transcript:
        raise HTTPException(status_code=400, detail="Transcript is empty.")

    # Format transcript for the prompt
    transcript_text = ""
    for entry in body.transcript:
        who = entry.get("who", "Unknown")
        text = entry.get("text", "")
        transcript_text += f"{who}: {text}\n"

    prompt = f"""You are Nova, an expert AI interview evaluator. Analyze this complete interview transcript and provide a comprehensive evaluation.

Candidate's resume:
{body.resume_summary}

Full Interview Transcript:
{transcript_text}

Evaluate the candidate and return ONLY a JSON object with these exact fields:
- "overall_score": integer 0-100 representing overall interview performance
- "clarity_score": integer 0-100 for communication clarity
- "structure_score": integer 0-100 for answer structure (STAR method, logical flow)
- "confidence_score": integer 0-100 for confidence and delivery
- "strengths": array of exactly 3 strings describing specific strengths (reference actual answers)
- "weaknesses": array of exactly 3 strings describing specific areas to improve (be constructive)
- "improvements": array of exactly 3 strings with actionable improvement tips
- "summary": a 3-4 sentence paragraph summarizing the candidate's overall performance, highlighting their best moment and main area for growth
- "score_label": one of "Exceptional", "Strong", "Good", "Developing", or "Needs Work" based on the overall_score

Be fair but encouraging. Reference specific parts of their actual answers when possible."""

    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"},
        )
    except Exception as e:
        print(f"❌ Groq API error: {e}")
        raise HTTPException(status_code=502, detail=f"Groq API error: {str(e)}")

    ai_response = chat_completion.choices[0].message.content
    try:
        result = json.loads(ai_response)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON.")

    print(f"✅ /finish — Score: {result.get('overall_score', 'N/A')}/100 "
          f"({result.get('score_label', 'N/A')})")

    return {
        "overall_score": result.get("overall_score", 75),
        "clarity_score": result.get("clarity_score", 75),
        "structure_score": result.get("structure_score", 75),
        "confidence_score": result.get("confidence_score", 75),
        "strengths": result.get("strengths", ["Good communication", "Clear answers", "Professional demeanor"]),
        "weaknesses": result.get("weaknesses", ["Could provide more examples", "Room for deeper analysis", "Consider more structured responses"]),
        "improvements": result.get("improvements", ["Practice STAR method", "Prepare specific examples", "Work on conciseness"]),
        "summary": result.get("summary", "The candidate showed good potential. With more preparation and practice, they can significantly improve their interview performance."),
        "score_label": result.get("score_label", "Good")
    }