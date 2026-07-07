import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ["/dashboard", "/account", "/notes"];
const localePattern = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeMatch = pathname.match(localePattern);
  const locale = localeMatch?.[1] ?? routing.defaultLocale;
  const pathWithoutLocale = pathname.replace(localePattern, "") || "/";

  const isProtected = protectedPaths.some((path) =>
    pathWithoutLocale.startsWith(path)
  );

  if (isProtected && !getSessionCookie(request)) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    return NextResponse.redirect(new URL(`${prefix}/login`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
