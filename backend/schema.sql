# Supabase SQL Schema for NotionFlow
# Run these queries in your Supabase SQL Editor

# Users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

# Pages table
CREATE TABLE pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

# Indexes for performance
CREATE INDEX idx_pages_user_id ON pages(user_id);
CREATE INDEX idx_pages_created_at ON pages(created_at);

# Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

# Users can only see their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

# Pages policies
CREATE POLICY "Users can view own pages" ON pages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pages" ON pages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pages" ON pages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pages" ON pages
    FOR DELETE USING (auth.uid() = user_id);