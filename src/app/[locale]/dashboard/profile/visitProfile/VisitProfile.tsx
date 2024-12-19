import React, { useEffect, useState } from 'react';

import Waves from '@/components/common/Waves';

const VisitProfile = () => {
  const [visit, setVisit] = useState<Number>(0);

  useEffect(() => {
    setVisit(13);
  }, []);
  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-md">
      <div className="relative flex h-40 items-end justify-center overflow-hidden">
        <Waves />
        <div className="relative z-10 mb-5 text-5xl font-bold text-white">
          {visit.toString()}
          <p className="text-xl">Visitas al perfil</p>
        </div>
      </div>
    </div>
  );
};

export default VisitProfile;
