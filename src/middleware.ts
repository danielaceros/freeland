import {
  type NextRequest,
} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { AllLocales, AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});


export default function middleware(
  request: NextRequest,
) {
  // Simply process the internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring).*)', '/', '/(api|trpc)(.*)'],
};
