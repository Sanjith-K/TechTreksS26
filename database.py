import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()  # loads .env locally; Railway uses dashboard env vars

key = os.getenv("SUPABASE_KEY")
print(f"SUPABASE_KEY starts with: {key[:20] if key else 'NONE'}")

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    key,
)
