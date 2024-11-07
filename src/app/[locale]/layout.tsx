import '@/styles/global.css';
import 'react-toastify/dist/ReactToastify.css';

import type { Metadata } from 'next';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ToastContainer } from 'react-toastify';

import { AllLocales } from '@/utils/AppConfig';

import AuthListener from '../../components/AuthListener';

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export function generateStaticParams() {
  return AllLocales.map((locale) => ({ locale }));
}

export default function RootLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(props.params.locale);

  // Using internationalization in Client Components
  const messages = useMessages();

  return (
    <html lang={props.params.locale}>
      <body className="bg-background text-foreground antialiased">
        <NextIntlClientProvider
          locale={props.params.locale}
          messages={messages}
          // eslint-disable-next-line prettier/prettier
        ><ToastContainer
            position="bottom-right"
            autoClose={5000} // Optional: Duration to auto close the toast
            hideProgressBar={false} // Optional: Show or hide the progress bar
            newestOnTop={false} // Optional: Show newest toast on top
            // eslint-disable-next-line prettier/prettier
        closeOnClick
            rtl={false} // Optional: Enable RTL support
            pauseOnFocusLoss
            // eslint-disable-next-line prettier/prettier
        draggable
            pauseOnHover
          />
          <AuthListener />
          {props.children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
