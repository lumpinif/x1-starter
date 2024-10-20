-- THIS IS OPTIONAL TO RUN THE DATABASE WITH SAMPLE DATA.

-- -- !! BEFORE YOU ARE RUNNING THIS SEED DATA !! -- --

-- IMPORTANT: IF YOU DIDN'T CORRECTLY PUSH THE MIGRATIONS, YOU WILL FAILD TO INSERT THIS SEED DATA.
-- YOU SHOULD CHECK IF THE MIGRATIONS ARE PUSHED AND IF YOU HAVE THE CORRECT DATABASE CONNECTION AND A SERIES SETTINGS SYNCRONIZED WITH THE REMOTE SUPABASE PROJECT.

-- CHECK THE FOLLOWING:
-- 1. IF YOU HAVE A TABLE NAMED "profiles" IN THE "public" SCHEMA.
-- 2. IF YOU HAVE THE FUNCTION NAMED "handle_new_user" IN THE "public" SCHEMA.
-- 3. IF YOU HAVE THE AUTH TRIGGER NAMED "on_auth_user_created_or_updated" IN THE "auth" SCHEMA.
-- 5. IF YOU HAVE THE CORRECT BUCKET NAMED "avatars" IN THE "storage" SCHEMA.
-- 4. IF YOU HAVE THE CORRECT SETTINGS WITH CUSTOM SMTP SETTINGS IF YOU HAVE ENABLED EMAIL VERIFICATION.
-- 5. IF YOU HAVE THE CORRECT RLS POLICIES FOR THE "profiles" TABLE AND "avatars" BUCKET.
-- 6. CHECK IF YOU HAVE CONFIGURED THE REDIRECT URL IN THE URL CONFIGURATION IN THE AUTHENTICATIONS SETTINGS PAGE. CHECK https://demo-nextjs-with-supabase.vercel.app FOR MORE INFORMATION.


-- HOW TO TEST IF THE TRIGGER AND FUNCTIONS IS WORKING FROM THE SUPABASE DASHBOARD:
-- 1. CREATE A NEW USER IN THE AUTHENTICATIONS AND USER PAGE WITH AUTO CONFIRM USER SET TO TRUE.
-- 2. CHECK IF THE USER WAS CREATED IN THE "auth.users" TABLE.
-- 3. CHECK IF THE USER WAS AUTOMATICALLY GENERATED IN THE "profiles" TABLE WITH CORRECT EMAIL AND ID.
-- 4. TRY TO UPDATE OR DELETE THE USER YOU JUST CREATED AND CHECK IF THE USER WAS UPDATED OR DELETED IN THE "profiles" TABLE.
-- 5. TRY TO LOGIN WITH THE NEW USER AND CHECK IF YOU CAN LOGIN.


-- NOTE: YOU CAN RUN THIS CODE IN THE SUPABASE SQL EDITOR IN THE DASHBOARD TO CREATE A NEW USER MANUALLY. --

insert into
  auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at,
    is_anonymous
  )
values