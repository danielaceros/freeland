import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Waves from '@/components/common/Waves';
import { auth, db } from '@/libs/firebase';

import type { Offer } from '../../hire/page';

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
        createdAt: new Date(docu.data().createdAt.seconds * 1000),
        fileUrl: docu.data().fileUrl,
      }));
      setNumOffer(offersData.length);
    } catch (error) {
      toast.error(t('error.fetchOffers'));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchOffers(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-md">
      <div className="relative flex h-40 items-end justify-center overflow-hidden rounded-b-xl p-2">
        <button
          type="button"
          className="text-left"
          onClick={() => router.push('/dashboard/hire')}
        >
          <Waves />
          <div className="relative z-10 mb-5 text-5xl font-bold text-white ">
            <span className="stroke-black">{numOffer.toString()}</span>
            <p className="text-xl">{`${numOffer === 1 ? t('profile.offerCreated') : t('profile.offersCreated')}`}</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default NumOffersProfile;
