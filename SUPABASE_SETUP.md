# Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`.
3. In Authentication, create the staff email and password that will access the admin.
4. Copy `.env.example` to `.env` and add the project URL and anon key from Project Settings, API.
5. Restart the site and open `/admin.html`.
6. Sign in and select **Import 48 products** once. All four existing collections will then be managed by Supabase.

For security, keep public user sign-ups disabled. The database allows public reads, but only authenticated staff can change catalog records or upload product images.
