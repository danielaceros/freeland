import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { Login } from '@/components/login/Login';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function IndexPage(props: { params: { locale: string } }) {
  unstable_setRequestLocale(props.params.locale);

  return <Login />;
}