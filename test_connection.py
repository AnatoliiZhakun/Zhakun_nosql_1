import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

print("Підключаюсь...")

try:
    client.admin.command("ping")
    print("✅ Підключення успішне!")
except Exception as e:
    print("❌ Помилка:")
    print(e)