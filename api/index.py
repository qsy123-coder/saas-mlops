from fastapi import FastAPI  # type: ignore
from fastapi.responses import PlainTextResponse  # type: ignore
from fastapi.responses import StreamingResponse
from openai import OpenAI  # type: ignore
import os
from dotenv import load_dotenv

app = FastAPI()
load_dotenv(".env.local", override=True)

@app.get("/api", response_class=PlainTextResponse)

def idea():
    current_api_key = os.environ.get("OPENAI_API_KEY")
    current_base_url = os.environ.get("OPENAI_API_BASE_URL", "https://api.siliconflow.cn/v1")
    client = OpenAI(
        api_key=current_api_key,
        base_url=current_base_url
    )
    prompt = [{"role": "user", "content": "Reply with a new business idea for AI Agents, formatted with headings, sub-headings and bullet points"}]
    stream = client.chat.completions.create(model="deepseek-ai/DeepSeek-V3", messages=prompt,stream=True)

    def event_stream():
        for chunk in stream:
            text = chunk.choices[0].delta.content
            if text:
                lines = text.split("\n")
                for line in lines:
                    yield f"data: {line}\n"
                yield "\n"
    return StreamingResponse(event_stream(), media_type="text/event-stream")