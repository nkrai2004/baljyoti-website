# AARIKA Agent v0.1

A working starter for an Agentic AI layer for AARIKA using the OpenAI Agents SDK.

## Included
- AARIKA Master Agent
- Learning specialist agent
- New Admission specialist agent
- School Support specialist agent
- Function tools for school data
- Policy retrieval / RAG-style knowledge search
- Intervention recommendations
- Safe follow-up task creation
- Simple browser UI
- Mock school data for testing

## Run
1. Python 3.10+
2. `pip install -r backend/requirements.txt`
3. Make `OPENAI_API_KEY` available to the server process.
4. `uvicorn backend.main:app --reload`
5. Open `http://127.0.0.1:8000`

## Demo prompts
- Analyse Class 10 attendance and identify students who need intervention.
- Check the attendance policy and recommend what the class teacher should do.
- Prepare a parent communication for the highest-risk students.
- Create a follow-up task for the Class 10 teacher.

## Production integration
Replace the mock functions in `backend/tools.py` with authenticated AARIKA APIs/database calls. Add tenant isolation, RBAC, audit logs, human approval for external communications, persistent sessions/tasks, and OpenAI File Search/vector stores for production RAG.
