// Define an array of public routes that don't require authentication
// If a user is signed in and tries to access one of these routes, they will be redirected to the home page

export const PUBLIC_ROUTES = [
  "/login",
  "/sign-up",
  "/magic-link",
  "/forgot-password",
];

// This array is used in middleware.ts (located at @src/utils/supabase/middleware.ts)
// to determine which routes should be accessible without authentication.
// The middleware uses this information to redirect users appropriately.

// Note: Used in middleware.ts from @src/utils/supabase/middleware.ts for redirecting users
