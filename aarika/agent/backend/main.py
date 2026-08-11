import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from agents import Runner
from .agents import aarika_agent

app = FastAPI(title="AARIKA Agent v0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AgentRequest(BaseModel):
    message: str

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "agent": "AARIKA Master Agent",
        "openai_key_configured": bool(os.getenv("OPENAI_API_KEY")),
    }

@app.post("/api/agent")
async def run_agent(req: AgentRequest):
    if not os.getenv("OPENAI_API_KEY"):
        return {"ok": False, "error": "OPENAI_API_KEY is not configured for the server process."}

    result = await Runner.run(aarika_agent, req.message, max_turns=12)

    return {
        "ok": True,
        "agent": result.last_agent.name,
        "answer": result.final_output,
        "usage": {
            "requests": result.context_wrapper.usage.requests,
            "input_tokens": result.context_wrapper.usage.input_tokens,
            "output_tokens": result.context_wrapper.usage.output_tokens,
            "total_tokens": result.context_wrapper.usage.total_tokens,
        },
    }

@app.get("/")
def index():
    return FileResponse("frontend/index.html")
