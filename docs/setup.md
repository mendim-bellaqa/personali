# Setup: Supabase (free) + Netlify

This document shows how to create a free Supabase project and connect it to your Netlify-deployed site so you can store user tasks securely.

1. Create a Supabase account
   - Go to https://supabase.com and sign up (free tier available).
   - Create a new project and choose a password (keep it safe).

2. Get API keys
   - In your Supabase project dashboard go to Settings -> API.
   - Copy the Project URL and the anon/public API key.

3. Configure Netlify environment variables
   - In Netlify, open your site settings (e.g., `https://app.netlify.com/sites/<your-site>`).
   - Under "Site settings -> Build & deploy -> Environment", add these variables:
     - VUE_APP_SUPABASE_URL = <your-supabase-url>
     - VUE_APP_SUPABASE_ANON_KEY = <your-anon-key>

4. Tables & Security
   - In Supabase, open the Table Editor and create a `tasks` table with columns:
     - id (bigint, primary key, auto increment)
     - user_id (uuid)
     - title (text)
     - description (text)
     - plan (text)
     - deadline (date)
     - image_url (text)
     - completed (boolean)
     - inserted_at (timestamp)
   - Add Row Level Security (RLS) and enable policies so only authenticated users can read and write their own tasks. Example SQL policy for SELECT:
     - Enable RLS on `tasks`.
     - Policy: `using (auth.uid() = user_id)` for SELECT and INSERT/UPDATE/DELETE accordingly.

5. Local development
   - Create a `.env.local` at project root with:
     - VUE_APP_SUPABASE_URL=<your-supabase-url>
     - VUE_APP_SUPABASE_ANON_KEY=<your-anon-key>
   - Run `npm install` then `npm run serve`.

6. Notes
   - Supabase handles email verification via links; you can create more advanced OTP flows with server functions.
   - This project currently persists tasks to localStorage and includes placeholders to integrate Supabase for authenticated users.

If you want, I can implement the full Supabase table sync and RLS-compliant queries next.
