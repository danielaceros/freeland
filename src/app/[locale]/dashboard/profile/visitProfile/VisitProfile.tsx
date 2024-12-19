import Waves from '@/components/common/Waves';
import React, { useEffect, useState } from 'react'

const VisitProfile = () => {
  const [visit, setVisit] = useState<Number>(0);

  useEffect(() =>{
    setVisit(13)
  }, [])
  return (
    <div className='w-full rounded-lg bg-white p-6 shadow-md'>
      <div className="relative h-40 flex items-end justify-center overflow-hidden">
        <Waves />
        <div className="relative z-10 text-white text-5xl font-bold mb-5">
            {visit.toString()}
          <p className='text-xl'>Visitas al perfil</p>
        </div>
      </div>
    </div>
  )
}

export default VisitProfile
