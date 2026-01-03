# NotionFlow Backend

## Setup

1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `schema.sql` in your Supabase SQL Editor
3. Copy `.env.example` to `.env` and fill in your Supabase credentials
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `python main.py`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Pages
- `GET /pages/` - Get user's pages
- `POST /pages/` - Create new page
- `GET /pages/{page_id}` - Get specific page
- `PUT /pages/{page_id}` - Update page
- `DELETE /pages/{page_id}` - Delete page

### Users
- `GET /users/me` - Get current user
- `PUT /users/me` - Update user profile

## Deployment

### Docker
```bash
docker build -t notionflow-backend .
docker run -p 8000:8000 --env-file .env notionflow-backend
```

### Railway/Render/Vercel
- Set environment variables in your deployment platform
- Deploy from this directory
- Set build command: `pip install -r requirements.txt`
- Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Data Structures (DS)
- PageManager class for efficient page operations
- Pydantic models for type safety
- In-memory data structures with DB persistence

## Database Management System (DBMS)
- Supabase PostgreSQL
- Row Level Security (RLS)
- Optimized indexes
- Real-time capabilities