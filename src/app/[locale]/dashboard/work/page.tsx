/* eslint-disable no-await-in-loop */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client';

import 'rc-slider/assets/index.css';
import '../../../../styles/slider.css';

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
import Slider from 'rc-slider';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';

import BarTop from '@/components/common/BarTop';
import Menu from '@/components/common/Menu';
import { loadUser } from '@/utils/utils';

import { auth, db, storage } from '../../../../libs/firebase';
import type { Offer } from '../hire/page';
import ViewCardHire from '../hire/viewCardHire/viewCardHire';

export default function Work() {
  const dispatch = useDispatch();
  const t = useTranslations();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [uploadPow, setUploadPow] = useState<string | null>(null);
  const [offerPow, setOfferPow] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [minDuration, setMinDuration] = useState<number>(1);
  const [maxDuration, setMaxDuration] = useState<number>(12);
  const offerSkillsOptions = [
    {
      category: t('categories.technology'), // Translated category name
      skills: [
        { value: 'javascript', label: t('skills.javascript') },
        { value: 'react', label: t('skills.react') },
        { value: 'nodejs', label: t('skills.nodejs') },
        { value: 'typescript', label: t('skills.typescript') },
        { value: 'python', label: t('skills.python') },
        { value: 'django', label: t('skills.django') },
        { value: 'ruby', label: t('skills.ruby') },
        { value: 'php', label: t('skills.php') },
        { value: 'go', label: t('skills.go') },
        { value: 'swift', label: t('skills.swift') },
        { value: 'kotlin', label: t('skills.kotlin') },
        { value: 'elixir', label: t('skills.elixir') },
      ],
    },
    {
      category: t('categories.videoEditing'),
      skills: [
        { value: 'premiere', label: t('skills.premiere') },
        { value: 'davinci', label: t('skills.davinci') },
        { value: 'finalcut', label: t('skills.finalcut') },
        { value: 'aftereffects', label: t('skills.aftereffects') },
        { value: 'audiocity', label: t('skills.audiocity') },
        { value: 'blender', label: t('skills.blender') },
        { value: 'hitfilm', label: t('skills.hitfilm') },
      ],
    },
    {
      category: t('categories.graphicDesign'),
      skills: [
        { value: 'photoshop', label: t('skills.photoshop') },
        { value: 'illustrator', label: t('skills.illustrator') },
        { value: 'figma', label: t('skills.figma') },
        { value: 'indesign', label: t('skills.indesign') },
        { value: 'coreldraw', label: t('skills.coreldraw') },
        { value: 'affinitydesigner', label: t('skills.affinitydesigner') },
        { value: 'canva', label: t('skills.canva') },
        { value: 'gimp', label: t('skills.gimp') },
      ],
    },
    {
      category: t('categories.digitalMarketing'),
      skills: [
        { value: 'seo', label: t('skills.seo') },
        { value: 'ads', label: t('skills.ads') },
        { value: 'facebookads', label: t('skills.facebookads') },
        { value: 'emailmarketing', label: t('skills.emailmarketing') },
        { value: 'contentmarketing', label: t('skills.contentmarketing') },
        { value: 'affiliatemarketing', label: t('skills.affiliatemarketing') },
        { value: 'analytics', label: t('skills.analytics') },
        {
          value: 'socialmediamarketing',
          label: t('skills.socialmediamarketing'),
        },
      ],
    },
    {
      category: t('categories.gameDevelopment'),
      skills: [
        { value: 'unity', label: t('skills.unity') },
        { value: 'unreal', label: t('skills.unreal') },
        { value: 'godot', label: t('skills.godot') },
        { value: 'csharp', label: t('skills.csharp') },
        { value: 'cpp', label: t('skills.cpp') },
        { value: 'gametesting', label: t('skills.gametesting') },
        { value: '3dmodeling', label: t('skills.3dmodeling') },
        { value: 'leveldesign', label: t('skills.leveldesign') },
      ],
    },
    {
      category: t('categories.dataScience'),
      skills: [
        { value: 'python', label: t('skills.python') },
        { value: 'r', label: t('skills.r') },
        { value: 'sql', label: t('skills.sql') },
        { value: 'machinelearning', label: t('skills.machinelearning') },
        { value: 'tensorflow', label: t('skills.tensorflow') },
        { value: 'pandas', label: t('skills.pandas') },
        { value: 'numpy', label: t('skills.numpy') },
        { value: 'matplotlib', label: t('skills.matplotlib') },
      ],
    },
    {
      category: t('categories.webDesign'),
      skills: [
        { value: 'html', label: t('skills.html') },
        { value: 'css', label: t('skills.css') },
        { value: 'javascript', label: t('skills.javascript') },
        { value: 'bootstrap', label: t('skills.bootstrap') },
        { value: 'sass', label: t('skills.sass') },
        { value: 'vuejs', label: t('skills.vuejs') },
        { value: 'angular', label: t('skills.angular') },
        { value: 'wordpress', label: t('skills.wordpress') },
        { value: 'responsive', label: t('skills.responsive') },
        { value: 'webflow', label: t('skills.webflow') },
      ],
    },
    {
      category: t('categories.cybersecurity'),
      skills: [
        { value: 'penetrationtesting', label: t('skills.penetrationtesting') },
        { value: 'ethicalhacking', label: t('skills.ethicalhacking') },
        { value: 'firewalls', label: t('skills.firewalls') },
        { value: 'networksecurity', label: t('skills.networksecurity') },
        { value: 'cryptography', label: t('skills.cryptography') },
        { value: 'forensics', label: t('skills.forensics') },
        { value: 'cyberthreat', label: t('skills.cyberthreat') },
      ],
    },
    {
      category: t('categories.projectManagement'),
      skills: [
        { value: 'agile', label: t('skills.agile') },
        { value: 'scrum', label: t('skills.scrum') },
        { value: 'jira', label: t('skills.jira') },
        { value: 'projectmanagement', label: t('skills.projectmanagement') },
        { value: 'trello', label: t('skills.trello') },
        { value: 'microsoftproject', label: t('skills.microsoftproject') },
        { value: 'asana', label: t('skills.asana') },
      ],
    },
    {
      category: t('categories.systemAdministration'),
      skills: [
        { value: 'linux', label: t('skills.linux') },
        { value: 'windowsserver', label: t('skills.windowsserver') },
        { value: 'docker', label: t('skills.docker') },
        { value: 'kubernetes', label: t('skills.kubernetes') },
        { value: 'ansible', label: t('skills.ansible') },
        { value: 'cloudcomputing', label: t('skills.cloudcomputing') },
        { value: 'aws', label: t('skills.aws') },
        { value: 'azure', label: t('skills.azure') },
        { value: 'devops', label: t('skills.devops') },
      ],
    },
    {
      category: t('categories.programmingLanguages'),
      skills: [
        { value: 'java', label: t('skills.java') },
        { value: 'c', label: t('skills.c') },
        { value: 'csharp', label: t('skills.csharp') },
        { value: 'swift', label: t('skills.swift') },
        { value: 'typescript', label: t('skills.typescript') },
        { value: 'python', label: t('skills.python') },
        { value: 'ruby', label: t('skills.ruby') },
        { value: 'go', label: t('skills.go') },
      ],
    },
  ];

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
            likes: offerDoc.data().likes || 0,
            visits: offerDoc.data().visits || 0,
            stars: offerDoc.data().totalStars || 0,
            name: offerDoc.data().name,
            description: offerDoc.data().description,
            descriptionShort: offerDoc.data().descriptionShort || '',
            duration: offerDoc.data().duration,
            durationValue: parseInt(offerDoc.data().durationValue, 10),
            priceHour: offerDoc.data().priceHour,
            priceMounth: offerDoc.data().priceMounth,
            priceProyect: offerDoc.data().priceProyect,
            currency: offerDoc.data().currency,
            categories: offerDoc.data().categories,
            skillsMin: offerDoc.data().skillsMin,
            createdAt: new Date(offerDoc.data().createdAt.seconds * 1000),
            fileUrl: offerDoc.data().fileUrl,
            userId: userDoc.id,
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

  useEffect(() => {
    loadUser(dispatch);
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

  const openModal = (offer: Offer) => {
    setSelectedOffer(offer);
    console.log(offer);
    setOfferPow(offer.fileUrl!);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOffer(null);
    setModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (file: File) => {
    console.log('File selected:', file);
    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error(t('selectFileToUpload'));
      console.error('No file selected');
      return;
    }
    console.log(selectedOffer?.userId);
    if (!selectedOffer || !selectedOffer.userId) return;

    try {
      console.log('Uploading file:', selectedFile);

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

      await setDoc(offerRef, { fileUrl: fileURL }, { merge: true });

      toast.success(t('powUploadSuccess'));
      setUploadPow(fileURL);
      closeModal();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(t('failedToUploadFile'));
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

  // Handle range sliders and skills filter
  const handlePriceRangeChange = (value: [number, number]) => {
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  };

  const handleDurationRangeChange = (value: [number, number]) => {
    setMinDuration(value[0]);
    setMaxDuration(value[1]);
  };

  // Create options formatted with categories for select
  const groupedOptions = offerSkillsOptions.map((category) => ({
    label: category.category, // Category as label
    options: category.skills, // Skills as options under this category
  }));

  const handleSkillSelect = (selectedOptions: any) => {
    setSelectedSkills(
      selectedOptions ? selectedOptions.map((option: any) => option.value) : [],
    );
  };

  // const handleLike = async (offer: Offer) => {
  //   try {
  //     const offerRef = doc(
  //       db,
  //       'users',
  //       selectedOffer!.userId ?? '', // Asegúrate de que sea un string no undefined
  //       'offers',
  //       selectedOffer!.id ?? '', // Asegúrate de que sea un string no undefined
  //     );
  //     const newLikes = offer.likes + 1;
  //     await updateDoc(offerRef, { likes: newLikes });
  //     toast.success(t('offerLiked'));
  //     setOffers((prevOffers) =>
  //       prevOffers.map((o) =>
  //         o.id === offer.id ? { ...o, likes: newLikes } : o,
  //       ),
  //     );
  //   } catch (error) {
  //     toast.error(t('failedToLikeOffer'));
  //   }
  // };

  // const handleStarRating = async (offer: Offer) => {
  //   console.log(offer);
  //   try {
  //     const offerRef = doc(
  //       db,
  //       'users',
  //       offer.userId ?? '', // Asegúrate de que sea un string no undefined
  //       'offers',
  //       offer.id ?? '', // Asegúrate de que sea un string no undefined
  //     );
  //     const offerf = await getDoc(offerRef);

  //     const offerData = offerf.data();

  //     await updateDoc(offerRef, {
  //       stars: offerData!.stars + 1,
  //     });

  //     toast.success(t('offerRated'));
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(t('failedToRateOffer'));
  //   }
  // };

  const handleVisit = async (offer: Offer) => {
    try {
      const offerRef = doc(db, 'users', offer.userId!, 'offers', offer.id!);
      const newVisits = offer.visits + 1;
      await updateDoc(offerRef, { visits: newVisits });

      setOffers((prevOffers) =>
        prevOffers.map((o) =>
          o.id === offer.id ? { ...o, visits: newVisits } : o,
        ),
      );
    } catch (error) {
      toast.error(t('failedToUpdateVisits'));
    }
  };

  // Filter offers based on price, duration, skills, and search term
  const filteredOffers = offers.filter((offer) => {
    const matchesPrice =
      offer.priceHour! >= minPrice && offer.priceHour! <= maxPrice;
    const matchesDuration =
      offer.durationValue! >= minDuration &&
      offer.durationValue! <= maxDuration;
    const matchesSkills = selectedSkills.every((skill: string) =>
      offer.skillsMin!.includes(skill),
    );
    const matchesSearchTerm =
      offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    return (
      matchesPrice && matchesDuration && matchesSkills && matchesSearchTerm
    );
  });

  return (
    <div className="flex max-h-screen overflow-y-hidden bg-gray-100">
      <Menu />
      <div className="min-h-screen flex-1 overflow-y-scroll">
        <main className="flex-1 px-6 pt-32">
          <BarTop />
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {user ? (
                <div className="flex flex-col">
                  {/* Search/Filter Section */}
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder={t('searchOffers')}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Price Filter */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold">{t('priceRange')}</h4>
                    <Slider
                      range
                      min={0}
                      max={1000}
                      step={10}
                      value={[minPrice, maxPrice]}
                      onChange={handlePriceRangeChange}
                    />
                    <div className="flex justify-between">
                      <span>{minPrice}€</span>
                      <span>{maxPrice}€</span>
                    </div>
                  </div>

                  {/* Duration Filter */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold">
                      {t('durationRange')}
                    </h4>
                    <Slider
                      range
                      min={1}
                      max={48}
                      step={1}
                      value={[minDuration, maxDuration]}
                      onChange={handleDurationRangeChange}
                    />
                    <div className="flex justify-between">
                      <span>
                        {minDuration} {t('months')}
                      </span>
                      <span>
                        {maxDuration} {t('months')}
                      </span>
                    </div>
                  </div>

                  {/* Skills Filter */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold">
                      {t('requiredSkills')}
                    </h4>
                    <Select
                      isMulti
                      options={groupedOptions} // Using grouped options with categories
                      onChange={handleSkillSelect}
                      getOptionLabel={(e) => `${e.label}`} // Adjust display format here
                    />
                  </div>

                  <div className="flex flex-wrap">
                    {filteredOffers.length > 0 ? (
                      filteredOffers.map((offer: Offer) => (
                        // <div key={offer.id}>
                        <ViewCardHire
                          key={offer.id}
                          offer={offer}
                          onOpenModal={openModal}
                          onClick={() => {
                            openModal(offer);
                            handleVisit(offer); // Aquí se maneja la visita
                          }}
                          // onLike={() => handleLike(offer)}
                          // onStarRating={() => handleStarRating(offer)}
                          // onVisit={() => handleVisit(offer)} // Aquí se pasa la propiedad onVisit
                        />
                        // </div>
                      ))
                    ) : (
                      <p className="text-gray-700">{t('noMatchingOffers')}</p>
                    )}
                  </div>

                  {modalOpen && selectedOffer && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
                        <div className="mb-5 flex w-full items-center justify-between border-b-2 border-gray-200 pb-5">
                          <div className="w-8/12">
                            <h2 className="mb-4 text-xl font-semibold">
                              {selectedOffer.name}
                            </h2>
                          </div>
                          <div className="flex flex-wrap items-center">
                            {(selectedOffer.priceProyect ||
                              selectedOffer.priceHour ||
                              selectedOffer.priceMounth) && (
                              <div className="w-auto rounded-md border-2 border-freeland p-2 font-bold text-freeland">
                                {selectedOffer.priceHour &&
                                  `${selectedOffer.priceHour}${selectedOffer.currency}/hora`}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex">
                          <div className="w-9/12 border-r-2 border-gray-200 pr-5">
                            <textarea
                              className="mb-4 size-full border-0"
                              readOnly
                            >
                              {selectedOffer.description}
                            </textarea>
                          </div>
                          <div className="w-3/12 pl-5">
                            <p className="mb-5 text-gray-700">
                              {t('hire.postedOn')}{' '}
                              {selectedOffer.createdAt.toLocaleDateString()}
                            </p>
                            <p className="mb-5 text-gray-700">
                              {t('hire.offerDuration')}:{' '}
                              {selectedOffer.durationValue}{' '}
                              {selectedOffer.duration}
                            </p>
                            <button
                              type="button"
                              onClick={handleViewRecruiterPoW}
                              className="block w-full rounded bg-freeland px-4 py-2 text-center text-white"
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
                          </div>
                        </div>
                        <div className="mt-5 w-full border-t-2 border-gray-200 pt-5">
                          <p className="text-md mb-5 font-bold">
                            Habilidades requeridas
                          </p>
                          {selectedOffer.skillsMin && (
                            <div className="mt-auto flex">
                              {selectedOffer.skillsMin.map(
                                (skill: string, i: number) => (
                                  <div
                                    key={`${skill}-${i.toString()}`}
                                    className="mb-2 mr-2 flex items-center rounded-full bg-freeland px-2 py-1 text-sm font-medium text-white"
                                  >
                                    {skill.toUpperCase()}
                                  </div>
                                ),
                              )}
                            </div>
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
  );
}
