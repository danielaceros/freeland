'use client';

import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Menu from '@/components/common/Menu';
import { auth, db } from '@/libs/firebase';

import FormNewHire from './formNewHire/FormNewHire';
import ViewUserHire from './viewUserHire/ViewUserHire';

export interface Offer {
  id: string;
  name: string;
  description: string;
  descriptionShort: string;
  createdAt: Date;
  duration: string;
  durationValue: string;
  priceHour: number;
  priceMounth: number;
  priceProyect: number;
  currency: string;
  categories: [];
  fileUrl?: string;
}

export default function Hire() {
  const t = useTranslations(); // Initialize translations
  const [user, setUser] = useState<User | null>(null); // User state
  const [offers, setOffers] = useState<Offer[]>([]); // State for job offers
  const [loading, setLoading] = useState(true);
  const [saveHire, setSaveHire] = useState(false);
  const [openNewHire, setOpenNewHire] = useState(false);

  // Function to fetch job offers from Firestore
  const fetchOffers = async (uid: string) => {
    const offersCollection = collection(db, 'users', uid, 'offers');
    const q = query(offersCollection, orderBy('createdAt', 'desc'));

    try {
      const querySnapshot = await getDocs(q);
      const offersData: Offer[] = querySnapshot.docs.map((docu) => ({
        id: docu.id,
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
        createdAt: new Date(docu.data().createdAt.seconds * 1000), // Convert Firestore timestamp to Date
        fileUrl: docu.data().fileUrl, // Get the file URL if exists
      }));
      setOffers(offersData); // Update the offers state
    } catch (error) {
      toast.error(t('error.fetchOffers'));
    }
  };

  // Effect to retrieve current user information and job offers
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user state if user is logged in
        await fetchOffers(currentUser.uid); // Fetch offers for the logged-in user
      } else {
        setUser(null); // No user logged in
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onOpenNewHire = () => {
    setOpenNewHire(true);
  };

  const onCloseNewHire = () => {
    setOpenNewHire(false);
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex h-full items-center justify-center">
      <div className="size-16 animate-spin rounded-full border-y-4 border-green-600" />
    </div>
  );

  const saveNewHire = () => {
    setSaveHire(true);
  };

  return (
    <div className="flex max-h-screen overflow-y-hidden bg-gray-100">
      <Menu />
      <div className=" min-h-screen flex-1 overflow-y-scroll">
        <div className="flex flex-1 flex-col">
          <main className="flex-1 px-16 py-6">
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
                  />
                ) : (
                  <ViewUserHire
                    user={user}
                    offers={offers}
                    onFetchOffers={fetchOffers}
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
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={saveNewHire}
                        className="ml-5 mt-1 rounded bg-freeland px-4 py-2 text-white hover:bg-green-500"
                      >
                        Guardar
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