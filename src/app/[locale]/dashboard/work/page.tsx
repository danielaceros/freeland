/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client';

import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

import Menu from '@/components/common/Menu';

import { auth, db, storage } from '../../../../libs/firebase';
import type { Offer } from '../hire/page';
import ViewCardHire from '../hire/viewCardHire/viewCardHire';

export default function Work() {
  const t = useTranslations();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [uploadPow, setuploadPow] = useState<string | null>(null);
  const [offerPow, setofferPow] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await fetchOffers();
      } else {
        console.log(t('noUserAuthenticated'));
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchOffers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const offersData: Offer[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const offersCollection = collection(userDoc.ref, 'offers');
        // eslint-disable-next-line no-await-in-loop
        const offersSnapshot = await getDocs(offersCollection);

        for (const offerDoc of offersSnapshot.docs) {
          offersData.push({
            id: offerDoc.id,
            name: offerDoc.data().name,
            description: offerDoc.data().description,
            descriptionShort: offerDoc.data().descriptionShort,
            duration: offerDoc.data().duration,
            durationValue: offerDoc.data().durationValue,
            priceHour: offerDoc.data().priceHour,
            priceMounth: offerDoc.data().priceMounth,
            priceProyect: offerDoc.data().priceProyect,
            currency: offerDoc.data().currency,
            categories: offerDoc.data().categories,
            skillsMin: offerDoc.data().skillsMin,
            createdAt: new Date(offerDoc.data().createdAt.seconds * 1000), // Convert Firestore timestamp to Date
            fileUrl: offerDoc.data().fileUrl, // Get the file URL if exists
            recruiterVideoUrl: offerDoc.data().recruiterVideoUrl,
          });
        }
      }

      setOffers(offersData);
    } catch (error) {
      console.error(t('errorFetchingOffers'), error);
      toast.error(t('failedToFetchOffers'));
    }
  };

  const openModal = (offer: Offer) => {
    console.log('asdasdas');
    setSelectedOffer(offer);
    setofferPow(offer.fileUrl!);
    console.log(offer.fileUrl!);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOffer(null);
    setModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file); // Preview URL for the selected file
    setPreviewUrl(fileUrl);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error(t('selectFileToUpload'));
      return;
    }

    if (!selectedOffer || !selectedOffer.userId) return;

    try {
      const storageRef = ref(
        storage,
        `offers/${selectedOffer.userId}/${selectedOffer.id}/freelance/${user!.uid}/${selectedFile.name}`,
      );
      await uploadBytes(storageRef, selectedFile);
      const fileURL = await getDownloadURL(storageRef);

      const offerRef = doc(
        db,
        'users',
        selectedOffer.userId,
        'offers',
        selectedOffer.id,
        'freelance',
        user!.uid,
      );

      // Use setDoc with merge: true to create the document if it doesn't exist
      await setDoc(offerRef, { fileUrl: fileURL }, { merge: true });

      toast.success(t('powUploadSuccess'));
      setuploadPow(fileURL);
      closeModal();
    } catch (error) {
      console.error(t('errorUploadingFile'), error);
      toast.error(t('failedToUploadFile'));
    }
  };

  const handleRemovePoW = async () => {
    if (!selectedOffer || !selectedOffer.fileUrl) return;

    try {
      const fileRef = ref(storage, selectedOffer.fileUrl);
      await deleteObject(fileRef);

      if (selectedOffer.userId && selectedOffer.id) {
        const offerRef = doc(
          db,
          'users',
          selectedOffer.userId,
          'offers',
          selectedOffer.id,
        );
        await updateDoc(offerRef, { fileUrl: null });

        toast.success(t('powRemoveSuccess'));
        closeModal();
        router.push('/dashboard/work');
      }
    } catch (error) {
      console.error(t('errorRemovingFile'), error);
      toast.error(t('failedToRemoveFile'));
    }
  };

  const handleViewPoW = async () => {
    if (uploadPow) {
      window.open(uploadPow, '_blank');
    }
  };

  const handleViewRecruiterPoW = async () => {
    if (offerPow) {
      window.open(offerPow, '_blank');
    }
  };

  const LoadingSpinner = () => (
    <div className="flex h-full items-center justify-center">
      <div className="size-16 animate-spin rounded-full border-y-4 border-green-600" />
    </div>
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileChange(acceptedFiles[0]!);
      }
    },
  });

  return (
    <div className="flex max-h-screen overflow-y-hidden bg-gray-100">
      <Menu />
      <div className="min-h-screen flex-1 overflow-y-scroll">
        <div className="flex flex-1 flex-col">
          {/* <header className="flex items-center justify-between bg-white p-4 shadow">
            <h2 className="text-3xl font-semibold">{t('work')}</h2>
          </header> */}

          <main className="flex-1 p-6">
            {loading ? (
              <LoadingSpinner />
            ) : (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {user ? (
                  <div className="flex flex-wrap">
                    {offers.length > 0 ? (
                      offers.map((offer: Offer) => (
                        <ViewCardHire
                          key={offer.id}
                          offer={offer}
                          onOpenModal={openModal}
                        />
                      ))
                    ) : (
                      <p className="text-gray-700">{t('noActiveJobOffers')}</p>
                    )}

                    {modalOpen && selectedOffer && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                          <h2 className="mb-4 text-xl font-semibold">
                            {selectedOffer.name}
                          </h2>
                          <p className="mb-4">{selectedOffer.description}</p>
                          <p className="text-gray-700">
                            {t('postedOn')}{' '}
                            {selectedOffer.createdAt.toLocaleDateString()}
                          </p>
                          <br />
                          <button
                            type="button"
                            onClick={handleViewRecruiterPoW}
                            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500"
                          >
                            {t('downloadPoW')}
                          </button>
                          <div
                            {...getRootProps()}
                            className="mt-4 cursor-pointer border-4 border-dashed p-6 text-center"
                          >
                            <input {...getInputProps()} />
                            {selectedFile ? (
                              <div>
                                <p>
                                  {t('fileSelected')} {selectedFile.name}
                                </p>
                                {selectedFile.type.startsWith('video/') ? (
                                  // eslint-disable-next-line jsx-a11y/media-has-caption
                                  <video controls className="w-full">
                                    <source
                                      src={previewUrl!}
                                      type="video/mp4"
                                    />
                                  </video>
                                ) : (
                                  <img
                                    src={previewUrl!}
                                    alt="Selected file preview"
                                    className="h-auto w-full object-contain"
                                  />
                                )}
                              </div>
                            ) : (
                              <p>{t('dragAndDrop')}</p>
                            )}
                          </div>

                          <div className="mt-4 flex justify-end space-x-4">
                            <button
                              type="button"
                              onClick={closeModal}
                              className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                            >
                              {t('close')}
                            </button>
                            {uploadPow && (
                              <button
                                type="button"
                                onClick={handleViewPoW}
                                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500"
                              >
                                {t('previewPoW')}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={handleRemovePoW}
                              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                            >
                              {t('removePoW')}
                            </button>
                            <button
                              type="button"
                              onClick={handleFileUpload}
                              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500"
                            >
                              {uploadPow ? t('changePoW') : t('uploadPoW')}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{t('mustBeLoggedIn')}</p>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
