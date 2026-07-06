from pydantic import BaseModel


class AIChatSchema(BaseModel):
    question: str