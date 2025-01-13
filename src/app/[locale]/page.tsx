import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { Login } from '@/components/login/Login';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('freeland'),
    description: 'Freeland',
  };
}

export default function IndexPage(props: { params: { locale: string } }) {
  unstable_setRequestLocale(props.params.locale);

  return <Login />;
}
