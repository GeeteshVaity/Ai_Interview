```markdown
# AI Interview MVP Platform

An interactive, AI-powered mock interview web application featuring a modern frontend and a Python backend[cite: 2].

---

## Features

* **Interactive Landing Page**: Modern UI featuring hero sections, feature showcases, interactive portals, and a custom robot mascot (`AetherPortal`, `RobotMascot`)[cite: 2].
* **Complete Interview Workflow**: Dedicated routes and views for uploading resumes or materials, running the interview session, reviewing processing/analysis states, and tracking performance results[cite: 2].
* **Python Backend**: Includes a modular Python backend service configured with `requirements.txt`[cite: 2].

---

## Project Structure

```text
Ai_Interview-mvp-development/
├── backend/                  # Python backend services and APIs
│   ├── main.py               # Main application entry point
│   └── requirements.txt      # Python dependencies
├── public/                   # Static public assets
├── src/                      # Frontend source code
│   ├── assets/               # Images and graphics (e.g., robot mascot, aether)
│   ├── components/           # Reusable UI elements (Landing, Robot, UI primitives)
│   ├── hooks/                # Custom React hooks (e.g., use-mobile)
│   ├── lib/                  # Utility functions and error-reporting wrappers
│   ├── routes/               # Application pages (index, upload, interview, analyzing, results)
│   ├── router.tsx            # Router configurations
│   ├── server.ts             # Server entry/configurations
│   └── styles.css            # Global application stylesheets
├── package.json              # Node.js dependencies and scripts
└── vite.config.ts            # Vite configuration

```

---

## Tech Stack

* **Frontend**: React, Vite, TypeScript, Tailwind CSS, Radix UI components
* **Backend**: Python (with dependency management via `requirements.txt`)


* **Package Management**: Bun / npm



---

## Getting Started

### Prerequisites

* Node.js / Bun


* Python 3.12+



### Installation & Running

1. **Clone the repository** and navigate to the project directory.


2. **Install Frontend Dependencies**:
```bash
bun install
# or
npm install

```


3. **Set up and Run the Backend**:
Navigate to the `backend` folder, install the required python packages, and start the Uvicorn server:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

```


4. **Run the Development Server (Frontend)**:
Open a separate terminal window and run:
```bash
bun run dev
# or
npm run dev

```



```

```
