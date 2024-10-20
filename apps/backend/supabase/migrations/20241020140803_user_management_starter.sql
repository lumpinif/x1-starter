-- Enable moddatetime extension
create extension moddatetime
with
  schema extensions;

-- Create a table for public profiles
create table
  public.profiles (
    -- This line defines the 'id' column for the 'profiles' table:
    id uuid references auth.users on update cascade on delete cascade not null primary key,
    -- Explanation:
    -- 1. 'id' is the column name
    -- 2. 'uuid' is the data type (Universally Unique Identifier)
    -- 3. 'references auth.users' creates a foreign key relationship with the 'auth.users' table
    -- 4. 'on update cascade' means if the referenced user's ID changes, update this profile's ID too
    -- 5. 'on delete cascade' means if the referenced user is deleted, delete this profile too
    -- 6. 'not null' ensures this column always has a value
    -- 7. 'primary key' makes this column the unique identifier for each row in the profiles tablenot null primary key,
    user_name text not null unique,
    email text not null unique,
    avatar_url text,
    full_name text,
    user_bio text,
    user_location text,
    user_pronouns text,
    user_website text,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone default now(),

    -- Ensure username length is between 3 and 19 characters
    constraint profiles_user_name_check check (char_length(user_name) >= 3 and char_length(user_name) < 20)
  );

-- Create trigger to automatically update updated_at
create trigger handle_profiles_updated_at before update on profiles
  for each row execute function moddatetime (updated_at);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/database/postgres/row-level-security for more details.
alter table profiles
  enable row level security;

-- Define RLS policies for the profiles table
-- Allow public read access to all profiles
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

-- Allow users to create their own profile
create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

-- Allow users to update only their own profile
create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Function to automatically create a profile when a new user signs up
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
declare
    base_username text;
    new_username text;
    username_suffix text;
    retry_count int := 0;
    max_retries int := 3;
begin
    -- Skip if email is not confirmed
    if new.email_confirmed_at is null then
        return new;
    end if;

    -- Generate base username from user metadata or email
    base_username := lower(regexp_replace(coalesce(
        nullif(new.raw_user_meta_data->>'user_name', ''),
        nullif(new.raw_user_meta_data->>'name', ''),
        split_part(new.email, '@', 1)
    ), '[^a-zA-Z0-9_]', '', 'g'));

    base_username := substring(base_username from 1 for 10);

    -- Generate unique username
    loop
        username_suffix := to_char(current_timestamp, 'YYMMDD') || substring(md5(new.id::text || retry_count::text) from 1 for 4);
        new_username := substring(base_username || '_' || username_suffix from 1 for 19);

        -- Check if the generated username is unique
        -- If it is, exit the loop; if not, we'll generate a new one
        if not exists (select 1 from public.profiles where user_name = new_username) then
            exit;
        end if;

        -- Retry with a different suffix or use a fallback username
        retry_count := retry_count + 1;
        if retry_count >= max_retries then
            new_username := 'user_' || substring(md5(new.id::text || current_timestamp::text) from 1 for 14);
            exit;
        end if;
    end loop;

    -- Insert or update profile information
    insert into public.profiles(id, email, user_name, full_name, avatar_url)
    values (
        new.id,
        new.email,
        new_username,
        nullif(new.raw_user_meta_data->>'full_name', ''),
        nullif(new.raw_user_meta_data->>'avatar_url', '')
    )
    on conflict (id) do update set
        user_name = coalesce(public.profiles.user_name, excluded.user_name),
        full_name = coalesce(public.profiles.full_name, excluded.full_name),
        avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
        updated_at = now();

    return new;
exception
    -- Log any errors without stopping the user creation process
    when others then
        raise log 'Error in handle_new_user: %', sqlerrm;
        return new;
end;
$$ language plpgsql security definer;

-- Set up Storage!
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true);

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage/security/access-control#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update their own avatar." on storage.objects
  for update using ((select auth.uid()) = owner) with check (bucket_id = 'avatars');

-- Create the trigger to call handle_new_user function when a new user is created
create trigger on_auth_user_created_or_updated
  after insert or update on auth.users
  for each row execute procedure public.handle_new_user();


-- NOTE: USE THIS COMMAND TO INITIALIZE A SERIES OF NEW MIGRATIONS TO THE DATABASE
-- bunx supabase db push -p 'your database password'