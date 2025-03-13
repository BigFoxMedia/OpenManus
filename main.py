# main.py
import asyncio
from app.agent.manus import Manus
from app.logger import logger

async def process_input(prompt: str) -> str:
    if not prompt.strip():
        logger.warning("Empty prompt provided.")
        return "No input provided"
    logger.warning("Processing your request...")
    # Run the agent (if agent.run returns a result, you can capture it)
    await Manus().run(prompt)
    logger.info("Request processing completed.")
    return "Request processing completed."

async def main():
    prompt = input("Enter your prompt: ")
    result = await process_input(prompt)
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
