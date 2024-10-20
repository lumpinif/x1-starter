Assume you have already created a new supabase project in the supabase dashboard.

### Set Up Supabase Project
1. `cd apps/backend` into current directory
1. bunx supabase link --project-ref [your-project-ref]
2. run `bun db:push` or `bunx supabase db push -p 'your database password'` 
This command will apply the migrations defined in: apps/backend/supabase/migrations/20241020140803_user_management_starter.sql


### Seed the Database (Optional)

To test your setup with sample data:

1. Open the SQL editor in your Supabase dashboard
2. Copy the contents of the seed file: apps/backend/supabase/seed.sql
3. Paste into the SQL editor and run the script

### Configure Environment Variables

Copy and paste `.env.example` to create a `.env` file in the `apps/backend/supabase` directory and add necessary environment variables

Follow these steps to test your setup:

1. Create a new user in the Supabase Authentication dashboard
2. Check if the user was created in the `auth.users` table
3. Verify if a corresponding entry was created in the `public.profiles` table
4. Try updating the user and check if the `profiles` table is updated
5. Attempt to log in with the new user

### Verify Configurations

Ensure the following are set up correctly:

1. Check the `handle_new_user` function in Database > Functions
2. Verify the `on_auth_user_created_or_updated` trigger in Database > Triggers
3. Confirm the `avatars` bucket exists in Storage
4. Check the bucket's RLS policies
5. Verify email templates in Authentication > Email Templates (if applicable)

## Project Structure

- `migrations/`: Contains database migration files
- `seed.sql`: Sample data for testing
- `config.toml`: Supabase configuration file

## Troubleshooting

If you encounter issues:

1. Check the Supabase logs in the dashboard
2. Verify all steps in the `seed.sql` file comments
3. Ensure your database connection is correct
4. Double-check that all migrations were applied successfully

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase GitHub Repository](https://github.com/supabase/supabase)