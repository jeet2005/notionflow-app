from supabase import create_client, Client
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "your-supabase-url")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "your-supabase-anon-key")

supabase: Optional[Client] = None

def init_db():
    global supabase
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("Connected to Supabase")

def get_db() -> Client:
    if supabase is None:
        init_db()
    return supabase