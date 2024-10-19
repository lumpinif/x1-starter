import { updateSession } from "@x1-starter/supabase/middleware";
import { createI18nMiddleware } from "next-international/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTES } from "./config/routes";

// Create an internationalization middleware instance
// This handles language routing and localization
const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "cn", "fr"],
  defaultLocale: "en",
  urlMappingStrategy: "rewriteDefault",
});

export async function middleware(request: NextRequest) {
  // First, apply the I18n middleware
  const i18nResponse = I18nMiddleware(request);

  // Update the user session and apply I18n middleware
  // This handles authentication and sets up language preferences
  // Then, update the Supabase session
  const { response, user } = await updateSession(request, i18nResponse);

  const nextUrl = request.nextUrl;
  const pathnameLocale = nextUrl.pathname.split("/", 2)?.[1];

  // Remove the locale from the pathname
  const pathnameWithoutLocale = pathnameLocale
    ? nextUrl.pathname.slice(pathnameLocale.length + 1)
    : nextUrl.pathname;

  // Create a new URL without the locale in the pathname
  const newUrlWithoutLocale = new URL(
    pathnameWithoutLocale || "/",
    request.url,
  );

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    newUrlWithoutLocale.pathname.startsWith(route),
  );

  // Not authenticated
  if (!user && !isPublicRoute) {
    const encodedSearchParams = `${newUrlWithoutLocale.pathname.substring(1)}${newUrlWithoutLocale.search}`;

    const loginUrl = new URL(`/${pathnameLocale}/login`, request.url);

    if (encodedSearchParams) {
      loginUrl.searchParams.append("redirect_to", encodedSearchParams);
    }

    return NextResponse.redirect(loginUrl);
  }

  // Authenticated but trying to access public route
  if (user && isPublicRoute && newUrlWithoutLocale.pathname !== "/") {
    const redirectUrl = new URL(`/${pathnameLocale}/`, request.url);

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

// Configuration for which routes the middleware should run on
export const config = {
  matcher: [
    // Match all routes, including those without a locale prefix
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
