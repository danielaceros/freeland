import { auth, db } from '@/libs/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import type { Offer } from '../../hire/page';
import { useTranslations } from 'next-intl';
import { onAuthStateChanged } from 'firebase/auth';
import Waves from '@/components/common/Waves';
import { useRouter } from 'next/navigation';

const NumOffersProfile = () => {
  const t = useTranslations();
  const router = useRouter();
  
  const [numOffer, setNumOffer] = useState<Number>(0);

  const fetchOffers = async (uid: string) => {
    const offersCollection = collection(db, 'users', uid, 'offers');
    const q = query(offersCollection, orderBy('createdAt', 'desc'));

    try {
      const querySnapshot = await getDocs(q);
      const offersData: Offer[] = querySnapshot.docs.map((docu) => ({
        id: docu.id,
        likes: docu.data().likes || 0,
        visits: docu.data().visits || 0,
        stars: docu.data().stars || 0,
        totalStars: docu.data().totalStars || 0,
        name: docu.data().name,
        description: docu.data().description,
        descriptionShort: docu.data().descriptionShort,
        duration: docu.data().duration,
        durationValue: docu.data().durationValue,
        priceHour: docu.data().priceHour,
        priceMounth: docu.data().priceMounth,
        priceProyect: docu.data().priceProyect,
        currency: docu.data().currency,
        categories: docu.data().categories,
        skillsMin: docu.data().skillsMin,
        userId: uid,
        createdAt: new Date(docu.data().createdAt.seconds * 1000), // Convert Firestore timestamp to Date
        fileUrl: docu.data().fileUrl, // Get the file URL if exists
      }));
      setNumOffer(offersData.length); // Update the offers state
    } catch (error) {
      toast.error(t('error.fetchOffers'));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchOffers(currentUser.uid); // Fetch offers for the logged-in user
      } 
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className='w-full rounded-lg bg-white p-6 shadow-md'>
      <div className="relative h-40 flex items-end justify-center overflow-hidden">
        <button type='button' className='text-left' onClick={() => router.push('/dashboard/hire')}>
          <Waves />
          <div className="relative z-10 text-white text-5xl font-bold mb-5">
            {numOffer.toString()}
            <p className='text-xl'>{`${numOffer === 1 ? 'Oferta creada' : 'Ofertas creadas'}`}</p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default NumOffersProfile
