from app.core.gemini import client

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Say hello and tell me your name."
)

print(response.text)