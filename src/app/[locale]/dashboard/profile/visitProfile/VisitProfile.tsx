import Waves from '@/components/common/Waves';

interface VisitProfileProps {
  visit: number;
}
const VisitProfile = (props: VisitProfileProps) => {
  const { visit } = props;
  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-md">
      <div className="relative flex h-40 items-end justify-center overflow-hidden">
        <Waves />
        <div className="relative z-10 mb-5 text-5xl font-bold text-white">
          {visit ? visit.toString() : 0}
          <p className="text-xl">Visitas al perfil</p>
        </div>
      </div>
    </div>
  );
};

export default VisitProfile;
