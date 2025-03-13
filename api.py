from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional

from app.config import config
from app.agent.manus import Manus
from app.agent.planning import PlanningAgent
from app.agent.swe import SWEAgent
from app.flow.flow_factory import FlowFactory

# Try importing get_logs; if not available, define a fallback.
try:
    from app.logger import get_logs, logger
except ImportError:
    from app.logger import logger
    def get_logs() -> List[str]:
        return ["Log retrieval not implemented."]

app = FastAPI(
    title="OpenManus API",
    description="API for OpenManus AI Assistant",
    version="0.1.0"
)

# Configure CORS middleware (for development, allow all origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, restrict to trusted origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    agent_type: str = "manus"  # Valid values: "manus", "planning", "swe"
    flow_type: Optional[str] = None  # Optional: specify a flow type

class ChatResponse(BaseModel):
    response: str
    agent_type: str
    flow_type: Optional[str] = None

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Handle chat requests and return the AI assistant's response.
    """
    logger.info(f"Received chat request: agent_type={request.agent_type}, flow_type={request.flow_type}")
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        # Select the appropriate agent based on the agent_type
        agent_type_lower = request.agent_type.lower()
        if agent_type_lower == "manus":
            agent = Manus()
        elif agent_type_lower == "planning":
            agent = PlanningAgent()
        elif agent_type_lower == "swe":
            agent = SWEAgent()
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported agent type: {request.agent_type}")

        # If a flow type is specified, create and run the flow;
        # otherwise, run the chosen agent.
        if request.flow_type:
            logger.info(f"Using flow type: {request.flow_type}")
            flow = FlowFactory.create_flow(request.flow_type)
            result = await flow.run(request.message)
        else:
            logger.info("Running agent with provided message.")
            result = await agent.run(request.message)

        return ChatResponse(
            response=result,
            agent_type=request.agent_type,
            flow_type=request.flow_type
        )
    except Exception as e:
        logger.exception("Error processing chat request")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/config")
async def get_config() -> Dict[str, Any]:
    """
    Get the current system configuration.
    """
    return {"llm": config.llm}

@app.get("/logs")
async def get_system_logs() -> Dict[str, List[str]]:
    """
    Get system log information.
    """
    logs = get_logs()
    return {"logs": logs}

# Mount the current directory as static files (if needed)
app.mount("/static", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
