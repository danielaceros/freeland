'use client';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { db } from '@/libs/firebase';

import type { Offer } from '../page';
import ViewCardHire from '../viewCardHire/viewCardHire';

interface ViewUserHireProps {
  user: any;
  onFetchOffers: (updateOffers: string) => void;
  offers: Offer[];
  onEditOffer: (offer: Offer) => void;
}

interface Freelancer {
  email: string;
  history: any[];
  company: string;
  description: string;
  fromDate: any;
  toDate: any;
  name: string;
  nick: string;
  nickname: string;
  phone: string;
  position: string;
  profilePicture: string;
  profilePictureBackground: string;
  skills: string[];
  surname: string;
}

interface Application {
  status: number;
  id: string;
  fileUrl?: string;
  additionalInfo?: string;
  freelancer?: Freelancer;
}

const ViewUserHire = (props: ViewUserHireProps) => {
  const { user, offers, onFetchOffers, onEditOffer } = props;
  const profileData = useSelector((state: any) => state.user.data);
  const t = useTranslations();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewoffers, setviewoffers] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

  const fetchApplications = async (offered: Offer) => {
    setviewoffers(false);
    setLoadingApplications(true);

    try {
      const freelanceRef = collection(
        db,
        'users',
        offered.userId!,
        'offers',
        offered.id,
        'freelance',
      );
      const snapshot = await getDocs(freelanceRef);

      const applicationsData: Application[] = [];

      /* eslint-disable no-await-in-loop */
      for (const docSnap of snapshot.docs) {
        const applicationData = {
          id: docSnap.id,
          ...docSnap.data(),
        };

        const freelancerDocRef = doc(db, 'users', docSnap.id);
        const freelancerSnap = await getDoc(freelancerDocRef);

        if (freelancerSnap.exists()) {
          const freelancerData = freelancerSnap.data();

          applicationsData.push({
            ...applicationData,
            freelancer: {
              email: freelancerData.email,
              history: freelancerData.history,
              company: freelancerData.company,
              description: freelancerData.description,
              fromDate: freelancerData.fromDate,
              toDate: freelancerData.toDate,
              name: freelancerData.name,
              nick: freelancerData.nick,
              nickname: freelancerData.nickname,
              phone: freelancerData.phone,
              position: freelancerData.position,
              profilePicture: freelancerData.profilePicture,
              profilePictureBackground: freelancerData.profilePictureBackground,
              skills: freelancerData.skills,
              surname: freelancerData.surname,
            },
            status: docSnap.data().status,
          });
        } else {
          console.warn(`Freelancer with ID ${docSnap.id} not found.`);
        }
      }
      /* eslint-enable no-await-in-loop */

      setApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications.');
    } finally {
      setLoadingApplications(false);
    }
  };

  // User check match
  const handleMatch = async (offered: Offer, app: Application) => {
    try {
      const applicationRef = doc(
        db,
        'users',
        offered.userId!,
        'offers',
        offered.id,
        'freelance',
        app.id,
      );
      const updateAp = applications.map((value: any) => {
        if (value.id === app.id) {
          return { ...value, status: 2 };
        }
        return value;
      });
      setApplications(updateAp);
      await updateDoc(applicationRef, {
        status: 2,
      });
      const freelancer = {
        id: app.id,
        user: `${app.freelancer?.name} ${app.freelancer?.surname}`,
        profilePicture: app.freelancer?.profilePicture || '',
      };
      const freelanceCreateOffer = {
        id: offered.userId,
        user: `${profileData?.name} ${profileData?.surname}`,
        profilePicture: profileData?.profilePicture || '',
      };

      const chatRef = collection(db, 'chats');
      const newChat = await addDoc(chatRef, {
        participants: [offered.userId, app.id],
        freelancer,
        freelanceCreateOffer,
        offerId: offered.id,
        createdAt: new Date(),
      });

      const messageRef = collection(db, 'chats', newChat.id, 'messages');
      await addDoc(messageRef, {
        senderId: offered.userId,
        message: 'Welcome to the chat!',
        createdAt: new Date(),
      });

      toast.success(t('hire.success.match'));
    } catch (error) {
      console.error('Error handling match:', error);
      toast.error(t('hire.error.match'));
    }
  };

  // User check pass
  const handlePass = async (offered: Offer, app: Application) => {
    try {
      const applicationRef = doc(
        db,
        'users',
        offered.userId!,
        'offers',
        offered.id,
        'freelance',
        app.id,
      );
      const updateAp = applications.map((value: any) => {
        if (value.id === app.id) {
          return { ...value, status: 1 };
        }
        return value;
      });
      setApplications(updateAp);
      await updateDoc(applicationRef, {
        status: 1,
      });

      toast.success(t('hire.error.pass'));
    } catch (error) {
      console.error('Error handling pass:', error);
      toast.error(t('hire.error.pass'));
    }
  };

  const openModal = (offer: Offer) => {
    setSelectedOffer(offer);
    fetchApplications(offer!);
    setModalOpen(true);
  };

  const openViewOffers = () => {
    setviewoffers(true);
  };

  const closeModal = () => {
    setSelectedOffer(null);
    setModalOpen(false);
  };

  const closeConfirmDeleteModal = () => {
    setOfferToDelete(null);
    setConfirmDeleteOpen(false);
  };

  const openConfirmDeleteModal = (offerId: string) => {
    setOfferToDelete(offerId);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteOffer = async () => {
    if (!offerToDelete) return;

    try {
      await deleteDoc(doc(db, 'users', user!.uid, 'offers', offerToDelete));
      toast.success(t('hire.success.offerDeleted'));
      onFetchOffers(user!.uid);
      closeConfirmDeleteModal();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast.error(t('hire.error.deleteOffer'));
    }
  };

  const showCurrency = (currency: string) => {
    return currency === 'euro' ? '€' : '$';
  };

  return (
    <div>
      <div
        className={`${modalOpen ? 'hidden flex-col flex-wrap sm:flex md:flex-row' : 'flex flex-col flex-wrap md:flex-row'}`}
      >
        {offers.length > 0 ? (
          offers.map((offer) => (
            <ViewCardHire
              key={offer.id}
              offer={offer}
              onOpenConfirmDeleteModal={openConfirmDeleteModal}
              onOpenModal={openModal}
              showEdit
              onEditOffer={onEditOffer}
            />
          ))
        ) : (
          <div className="flex min-h-screen w-full items-center justify-center">
            <h2 className="m-0 text-xl">
              {`Aún no has creado ninguna oferta. Añade ofertas desde el botón
              'Añadir oferta'`}
            </h2>
          </div>
        )}
      </div>

      {/* Modal for offer details */}
      {modalOpen && selectedOffer && (
        <div
          className={`${viewoffers ? 'hidden' : 'flex'} inset-0 items-center  justify-center overflow-x-auto bg-black bg-opacity-50 py-5 sm:fixed `}
        >
          <div className="w-11/12 max-w-5xl rounded-lg bg-white p-6 shadow-lg md:w-9/12">
            <div className="mb-5 flex w-full items-center justify-between border-b-2 border-gray-200 pb-5">
              <h2 className="text-xl font-semibold">{selectedOffer.name}</h2>
              <div className="flex flex-wrap items-center">
                {(selectedOffer.priceProyect ||
                  selectedOffer.priceHour ||
                  selectedOffer.priceMounth) && (
                  <div className="w-auto rounded-md border-2 border-freeland p-2 font-bold text-freeland">
                    {selectedOffer.priceHour &&
                      `${selectedOffer.priceHour}${showCurrency(selectedOffer.currency || '')}/hora`}
                    {selectedOffer.priceMounth &&
                      `${selectedOffer.priceMounth}${showCurrency(selectedOffer.currency || '')}/día`}
                    {selectedOffer.priceProyect &&
                      `${selectedOffer.priceProyect}${showCurrency(selectedOffer.currency || '')}/año`}
                  </div>
                )}
              </div>
            </div>
            <div className="md:heightPopup md:flex">
              <div className="border-r-2 border-gray-200 md:w-9/12 md:pr-5 ">
                <textarea className="mb-4 size-full min-h-40 border-0" readOnly>
                  {selectedOffer.description}
                </textarea>
              </div>
              <div className="md:w-3/12 md:pl-5">
                <p className="mb-5 text-gray-700">
                  {t('hire.postedOn')}
                  {': '}
                  {selectedOffer.createdAt.toLocaleDateString()}
                  {console.log(selectedOffer.id)!}
                  {console.log(selectedOffer.userId)!}
                </p>
                <p className="mb-5 text-gray-700">
                  {`${t('hire.offerDuration')}: ${selectedOffer.durationValue} ${selectedOffer.durationValue === 1 ? t('mes') : t('meses')}`}
                </p>
                {selectedOffer.fileUrl && (
                  <p>
                    <a
                      href={selectedOffer.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="my-5 block w-full rounded-md bg-freeland p-3 text-center font-bold text-white"
                    >
                      {t('hire.viewUploadedFile')}
                    </a>
                    <button
                      type="button"
                      onClick={openViewOffers}
                      className={`${applications.length === 0 ? 'bg-slate-300' : 'bg-freeland'} my-5 block w-full rounded-md p-3 text-center font-bold text-white`}
                      disabled={applications.length === 0}
                    >
                      {t('hire.openoffers')}
                    </button>
                  </p>
                )}
              </div>
            </div>
            <div className="mt-5 w-full border-t-2 border-gray-200 pt-5">
              <p className="text-md mb-5 font-bold">{t('requiredSkills')}</p>
              {selectedOffer.skillsMin && (
                <div className="mt-auto flex">
                  {selectedOffer.skillsMin.map((skill: string, i: number) => (
                    <div
                      key={`${skill}-${i.toString()}`}
                      className="mb-2 mr-2 flex items-center rounded-full bg-freeland px-2 py-1 text-sm font-medium text-white"
                    >
                      {skill.toUpperCase()}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="mb-10 mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500 sm:mb-0"
            >
              {t('hire.close')}
            </button>
          </div>
        </div>
      )}

      {modalOpen && selectedOffer && viewoffers && (
        <div className="inset-0 flex items-center justify-center bg-black bg-opacity-50 py-5 sm:fixed ">
          <div className="w-11/12 max-w-5xl overflow-auto rounded-lg bg-white p-6 shadow-lg md:w-9/12">
            {loadingApplications ? (
              <div className="text-center text-xl">Loading applications...</div>
            ) : (
              <div className="space-y-6">
                {applications &&
                  applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex flex-col border-b pb-4 md:flex-row"
                    >
                      <div className="mb-4 shrink-0 md:mb-0 md:mr-6">
                        <img
                          src={
                            app.freelancer?.profilePicture ||
                            '/default-profile.png'
                          }
                          alt={`${app.freelancer?.name}'s profile`}
                          className="size-24 rounded-full border-2 border-gray-300 object-cover"
                        />
                      </div>

                      <div className="grow">
                        <h3 className="text-xl font-semibold">
                          {app.freelancer?.name}
                        </h3>
                        <p className="text-gray-500">
                          {app.freelancer?.position || 'Freelancer'}
                        </p>

                        {/* Match/Pass Buttons */}
                        <div className="mt-4">
                          {(app.status === undefined ||
                            (app.status !== 1 && app.status !== 2)) && (
                            <>
                              <button
                                type="button"
                                className="mr-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-400"
                                onClick={() => handleMatch(selectedOffer, app)}
                                disabled={app.status === 2}
                              >
                                Match
                              </button>
                              <button
                                type="button"
                                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-400"
                                onClick={() => handlePass(selectedOffer, app)}
                                disabled={app.status === 1}
                              >
                                Pass
                              </button>
                            </>
                          )}

                          {/* Disabled Chat Button */}
                        </div>

                        {/* Chat Button */}

                        {app.freelancer?.company && (
                          <div className="mt-2">
                            <strong>{t('company')}:</strong>
                            <p>{app.freelancer?.company}</p>
                          </div>
                        )}

                        {app.freelancer?.description && (
                          <div className="mt-2">
                            <strong>{t('description')}:</strong>
                            <p>{app.freelancer?.description}</p>
                          </div>
                        )}

                        {app.freelancer?.skills &&
                          app.freelancer.skills.length > 0 && (
                            <div className="mt-2">
                              <strong>{t('skillsName')}:</strong>
                              <ul className="flex flex-wrap gap-2">
                                {app.freelancer.skills.map((skill) => (
                                  <li
                                    key={skill}
                                    className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700"
                                  >
                                    {skill}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {app.fileUrl && (
                          <div className="mt-2">
                            <a
                              href={app.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="my-5 block w-full rounded-md bg-freeland p-3 text-center font-bold text-white"
                            >
                              {t('hire.viewPow')}
                            </a>
                          </div>
                        )}

                        {app.additionalInfo && (
                          <div className="mt-2">
                            <strong>Información adicional:</strong>
                            <p>{app.additionalInfo}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <button
              type="button"
              onClick={closeModal}
              className="mx-auto mb-10 mt-6 w-full rounded bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-500 focus:outline-none sm:mb-0 md:w-auto"
            >
              {t('hire.close')}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">
              {t('hire.confirmDelete')}
            </h2>
            <p>{t('hire.deleteConfirmation')}</p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={closeConfirmDeleteModal}
                className="mr-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-400"
              >
                {t('hire.cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteOffer}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500"
              >
                {t('hire.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUserHire;
