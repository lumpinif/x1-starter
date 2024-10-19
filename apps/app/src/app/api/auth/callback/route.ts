import { Cookies } from "@/utils/constants";
import { supabaseServerClient } from "@v1/supabase/server";
import { addYears } from "date-fns";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/* 
The `/auth/callback` route is required for the server-side auth flow implemented
by the SSR package. It exchanges an auth code for the user's session.
https://supabase.com/docs/guides/auth/server-side/nextjs 
*/

export async function GET(request: Request) {
  const cookieStore = cookies();
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Use the 'redirect_to' param as the redirect URL, defaulting to '/' if not provided
  const redirectUrl = searchParams.get("redirect_to") ?? "/";
  const provider = searchParams.get("provider");

  // If a provider is specified, set a cookie to remember the user's preferred login method
  if (provider) {
    cookieStore.set(Cookies.PreferredSignInProvider, provider, {
      expires: addYears(new Date(), 1), // Cookie expires in 1 year
    });
  }

  if (code) {
    const supabase = supabaseServerClient();
    // Exchange the auth code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Handle redirects based on environment and forwarded host
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // In local development, use the original origin for redirect
        return NextResponse.redirect(`${origin}${redirectUrl}`);
      }
      if (forwardedHost) {
        // If there's a forwarded host (e.g., from a load balancer), use HTTPS with that host
        return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`);
      }
      // Default case: use the original origin
      return NextResponse.redirect(`${origin}${redirectUrl}`);
    }
  }

  // If there's no code or an error occurred, redirect to an error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
