'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '../../../../libs/firebase';
import { toast } from 'react-toastify';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import Menu from '@/components/common/Menu';
import { useDropzone } from 'react-dropzone';
import { useTranslations } from 'next-intl';

interface Offer {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Date;
  fileUrl?: string;
  recruiterVideoUrl?: string;
}

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
        const offersSnapshot = await getDocs(offersCollection);

        for (const offerDoc of offersSnapshot.docs) {
          offersData.push({
            id: offerDoc.id,
            userId: userDoc.id,
            name: offerDoc.data().name,
            description: offerDoc.data().description,
            createdAt: new Date(offerDoc.data().createdAt.seconds * 1000),
            fileUrl: offerDoc.data().fileUrl,
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
        `offers/${selectedOffer.userId}/${selectedOffer.id}/freelance/${user!.uid}/${selectedFile.name}`
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
        user!.uid
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

      const offerRef = doc(db, 'users', selectedOffer.userId, 'offers', selectedOffer.id);
      await updateDoc(offerRef, { fileUrl: null });

      toast.success(t('powRemoveSuccess'));
      closeModal();
      router.push('/dashboard/work');
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
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 border-b-4"></div>
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
    <div className="flex h-screen bg-gray-100">
      <Menu />

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between bg-white p-4 shadow">
          <h2 className="text-3xl font-semibold">{t('work')}</h2>
        </header>

        <main className="flex-1 p-6">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div>
              {user ? (
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t('allActiveJobOffers')}</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {offers.length > 0 ? (
                      offers.map((offer) => (
                        <div
                          key={offer.id}
                          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                          onClick={() => openModal(offer)}
                        >
                          <h4 className="text-lg font-semibold">{offer.name}</h4>
                          <p className="text-gray-600">{offer.description}</p>
                          <p className="text-gray-700">
                            {t('postedOn')} {offer.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-700">{t('noActiveJobOffers')}</p>
                    )}
                  </div>

                  {modalOpen && selectedOffer && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">{selectedOffer.name}</h2>
                        <p className="mb-4">{selectedOffer.description}</p>
                        <p className="text-gray-700">
                          {t('postedOn')} {selectedOffer.createdAt.toLocaleDateString()}
                        </p>
                        <br />
                        <button
                          onClick={handleViewRecruiterPoW}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                        >
                          {t('downloadPoW')}
                        </button>
                        <div
                          {...getRootProps()}
                          className="border-4 border-dashed p-6 text-center cursor-pointer mt-4"
                        >
                          <input {...getInputProps()} />
                          {selectedFile ? (
                            <div>
                              <p>{t('fileSelected')} {selectedFile.name}</p>
                              {selectedFile.type.startsWith('video/') ? (
                                <video controls className="w-full">
                                  <source src={previewUrl!} type="video/mp4" />
                                </video>
                              ) : (
                                <img
                                  src={previewUrl!}
                                  alt="Selected file preview"
                                  className="w-full h-auto object-contain"
                                />
                              )}
                            </div>
                          ) : (
                            <p>{t('dragAndDrop')}</p>
                          )}
                        </div>

                        <div className="mt-4 flex justify-end space-x-4">
                          <button
                            onClick={closeModal}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                          >
                            {t('close')}
                          </button>
                          {uploadPow && (
                            <button
                              onClick={handleViewPoW}
                              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                            >
                              {t('previewPoW')}
                            </button>
                          )}
                          <button
                            onClick={handleRemovePoW}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                          >
                            {t('removePoW')}
                          </button>
                          <button
                            onClick={handleFileUpload}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
