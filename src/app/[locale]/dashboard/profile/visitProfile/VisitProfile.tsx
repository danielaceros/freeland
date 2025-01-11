import { useTranslations } from 'next-intl';

import Waves from '@/components/common/Waves';

interface VisitProfileProps {
  visit: number;
}
const VisitProfile = (props: VisitProfileProps) => {
  const { visit } = props;
  const t = useTranslations();
  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-md">
      <div className="relative flex h-40 items-end justify-center overflow-hidden rounded-b-xl p-2">
        <Waves />
        <div className="relative z-10 mb-5 text-5xl font-bold text-white">
          <span className="stroke-black">{visit ? visit.toString() : 0}</span>
          <p className="text-xl">{t('profile.numVisit')}</p>
        </div>
      </div>
    </div>
  );
};

export default VisitProfile;
