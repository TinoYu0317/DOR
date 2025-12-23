# DOR - MVP

Digital Organism Recorder.
A single intake app for thoughts, voice, and files.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   ```
   
   Get these from your Supabase Project Settings -> API.

3. **Database Setup**
   Run the SQL script located in `supabase/schema.sql` in your Supabase SQL Editor to create the necessary tables and RLS policies.

4. **Run Locally**
   ```bash
   npm run dev
   ```

## Tech Stack
- Next.js 15 (App Router)
- Supabase (Auth + DB)
- Tailwind CSS
- Framer Motion
