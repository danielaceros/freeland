'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import BarTop from '@/components/common/BarTop';
import Menu from '@/components/common/Menu';
import { auth, db } from '@/libs/firebase';
import { loadUser } from '@/utils/utils';

import FormNewHire from './formNewHire/FormNewHire';
import ViewUserHire from './viewUserHire/ViewUserHire';

export interface Offer {
  likes: number;
  visits: number;
  stars: number;
  id: string;
  name: string;
  description: string;
  descriptionShort: string;
  createdAt: Date;
  duration?: string;
  durationValue?: number;
  priceHour?: number;
  priceMounth?: number;
  priceProyect?: number;
  currency?: string;
  categories?: string[];
  skillsMin?: string[];
  fileUrl?: string;
  userId?: string;
  recruiterVideoUrl?: string;
}

export default function Hire() {
  const dispatch = useDispatch();
  const t = useTranslations();
  const [user, setUser] = useState<User | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveHire, setSaveHire] = useState(false);
  const [openNewHire, setOpenNewHire] = useState(false);
  const [offerEdit, setOfferEdit] = useState<Offer>({} as Offer);

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
      setOffers(offersData);
    } catch (error) {
      toast.error(t('error.fetchOffers'));
    }
  };

  useEffect(() => {
    loadUser(dispatch);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchOffers(currentUser.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onOpenNewHire = () => {
    setOfferEdit({} as Offer);
    setOpenNewHire(true);
  };

  const onCloseNewHire = () => {
    setOpenNewHire(false);
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="size-16 animate-spin rounded-full border-y-4 border-green-600" />
    </div>
  );

  const saveNewHire = () => {
    setSaveHire(true);
  };

  const editOfferSelected = (offerObj: Offer) => {
    setOfferEdit(offerObj);
    setOpenNewHire(true);
  };

  return (
    <div className="flex max-h-screen overflow-y-hidden bg-gray-100">
      <Menu />
      <div className=" min-h-screen flex-1 overflow-y-scroll">
        <div className="flex flex-1 flex-col">
          <main className="flex-1 p-3  pt-20">
            <BarTop />
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div>
                {openNewHire ? (
                  <FormNewHire
                    user={user}
                    onFetchOffers={fetchOffers}
                    closeNewHire={onCloseNewHire}
                    saveHire={saveHire}
                    savedHire={(saved) => setSaveHire(saved)}
                    offerEdit={offerEdit}
                  />
                ) : (
                  <ViewUserHire
                    user={user}
                    offers={offers}
                    onFetchOffers={fetchOffers}
                    onEditOffer={editOfferSelected}
                  />
                )}
                <div className="fixed bottom-0 right-0 z-40 flex w-full justify-end  bg-white px-4 py-2 shadow-top">
                  {!openNewHire ? (
                    <button
                      type="button"
                      onClick={onOpenNewHire}
                      className="mt-1 rounded bg-freeland px-4 py-2 text-white hover:bg-green-500"
                    >
                      {t('hire.addOffer')}
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setOpenNewHire(false)}
                        className=" mt-1 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="button"
                        onClick={saveNewHire}
                        className="ml-5 mt-1 rounded bg-freeland px-4 py-2 text-white hover:bg-green-500"
                      >
                        {t('save')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
