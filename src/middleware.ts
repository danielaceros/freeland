import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { AllLocales, AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

// Function to check if the route is protected
const isProtectedRoute = (path: string) => {
  return (
    path.startsWith('/dashboard') ||
    path.startsWith('/onboarding')
  );
};

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // Simply process the internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring).*)', '/', '/(api|trpc)(.*)'],
};
