import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
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
  freelancer?: Freelancer; // Add freelancer property
}

const ViewUserHire = (props: ViewUserHireProps) => {
  const { user, offers, onFetchOffers, onEditOffer } = props;
  const t = useTranslations(); // Initialize translations
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null); // Selected offer for modal
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false); // Loading state for applications
  const [modalOpen, setModalOpen] = useState(false);
  const [viewoffers, setviewoffers] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // Confirmation modal state
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null); // Offer ID to delete
  const router = useRouter();

  const fetchApplications = async (offered: Offer) => {
    setviewoffers(false);
    setLoadingApplications(true);

    try {
      // Construct the path to the 'freelance' subcollection under the specific offer
      const freelanceRef = collection(
        db,
        'users',
        offered.userId!,
        'offers',
        offered.id,
        'freelance',
      );
      const snapshot = await getDocs(freelanceRef);

      // Extract application data and match with freelancer details
      const applicationsData: Application[] = [];

      // Loop through each application in the freelance collection
      /* eslint-disable no-await-in-loop */
      for (const docSnap of snapshot.docs) {
        const applicationData = {
          id: docSnap.id,
          ...docSnap.data(),
        };

        // Fetch the freelancer's data (e.g., name, email) from the 'users' collection
        const freelancerDocRef = doc(db, 'users', docSnap.id); // Use docSnap.id (the userId field) to fetch the user
        const freelancerSnap = await getDoc(freelancerDocRef);

        if (freelancerSnap.exists()) {
          const freelancerData = freelancerSnap.data();

          // Combine the application data with the freelancer's data
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
      console.log(applicationsData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications.');
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleMatch = async (offered: Offer, app: Application) => {
    try {
      // Update the freelancer application document with the "match" status
      const applicationRef = doc(
        db,
        'users',
        offered.userId!,
        'offers',
        offered.id,
        'freelance',
        app.id,
      );
      await updateDoc(applicationRef, {
        status: 2, // Mark the application as "matched"
      });

      // Create a chat between the recruiter and freelancer after the match
      const chatRef = collection(db, 'chats');
      const newChat = await addDoc(chatRef, {
        participants: [offered.userId, app.id], // Add the recruiter and freelancer to the chat
        offerId: offered.id,
        createdAt: new Date(),
      });

      // Optionally, create a default "Welcome to the chat" message
      const messageRef = collection(db, 'chats', newChat.id, 'messages');
      await addDoc(messageRef, {
        senderId: offered.userId,
        message: 'Welcome to the chat!',
        createdAt: new Date(),
      });

      toast.success('Match successful! A chat has been created.');

      // Redirect to the newly created chat (using newChat.id as the chatId)
      router.push(`/dashboard/chat/${newChat.id}`); // Ensure this is correct
    } catch (error) {
      console.error('Error handling match:', error);
      toast.error('Failed to create a match.');
    }
  };

  const handlePass = async (offered: Offer, app: Application) => {
    try {
      // Update the freelancer application document with the "pass" status
      const applicationRef = doc(
        db,
        'users',
        offered.userId!,
        'offers',
        offered.id,
        'freelance',
        app.id,
      );
      await updateDoc(applicationRef, {
        status: 1, // Mark the application as "passed"
      });

      toast.success('You passed on this application.');
    } catch (error) {
      console.error('Error handling pass:', error);
      toast.error('Failed to pass on this application.');
    }
  };
  // Function to open the modal with offer details
  const openModal = (offer: Offer) => {
    setSelectedOffer(offer);
    fetchApplications(offer!);
    setModalOpen(true);
  };

  const openViewOffers = () => {
    setviewoffers(true);
  };

  // Function to close the offer details modal
  const closeModal = () => {
    setSelectedOffer(null);
    setModalOpen(false);
  };

  // Function to close the delete confirmation modal
  const closeConfirmDeleteModal = () => {
    setOfferToDelete(null);
    setConfirmDeleteOpen(false);
  };

  // Function to open the delete confirmation modal
  const openConfirmDeleteModal = (offerId: string) => {
    setOfferToDelete(offerId);
    setConfirmDeleteOpen(true);
  };

  // Function to delete an offer
  const handleDeleteOffer = async () => {
    if (!offerToDelete) return; // Ensure there is an offer to delete

    try {
      // Delete the offer document from Firestore
      await deleteDoc(doc(db, 'users', user!.uid, 'offers', offerToDelete));
      toast.success(t('success.offerDeleted'));
      onFetchOffers(user!.uid); // Fetch updated offers after deletion
      closeConfirmDeleteModal(); // Close the confirmation modal
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast.error(t('error.deleteOffer'));
    }
  };

  const showCurrency = (currency: string) => {
    return currency === 'euro' ? '€' : '$';
  };

  return (
    <div>
      <div className="flex flex-wrap">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <ViewCardHire
              key={offer.id}
              offer={offer}
              onOpenConfirmDeleteModal={openConfirmDeleteModal}
              onOpenModal={openModal}
              showEdit
              onEditOffer={onEditOffer}
              // onLike={() => openModal(offer)}
              // onStarRating={() => openModal(offer)}
              // onVisit={() => openModal(offer)} // Aquí se pasa la propiedad onVisit
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
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
            <div className="flex" style={{ height: '350px' }}>
              <div className="w-9/12 border-r-2 border-gray-200 pr-5 ">
                <textarea className="mb-4 size-full border-0" readOnly>
                  {selectedOffer.description}
                </textarea>
              </div>
              <div className="w-3/12 pl-5">
                <p className="mb-5 text-gray-700">
                  {t('hire.postedOn')}{' '}
                  {selectedOffer.createdAt.toLocaleDateString()}
                  {console.log(selectedOffer.id)!}
                  {console.log(selectedOffer.userId)!}
                </p>
                <p className="mb-5 text-gray-700">
                  {t('hire.offerDuration')}: {selectedOffer.durationValue}{' '}
                  {selectedOffer.duration}
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
                      className="my-5 block w-full rounded-md bg-freeland p-3 text-center font-bold text-white"
                    >
                      {t('hire.openoffers')}
                    </button>
                  </p>
                )}
              </div>
            </div>
            <div className="mt-5 w-full border-t-2 border-gray-200 pt-5">
              <p className="text-md mb-5 font-bold">Habilidades requeridas</p>
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
              className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500"
            >
              {t('hire.close')}
            </button>
          </div>
        </div>
      )}

      {modalOpen && selectedOffer && viewoffers && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-5xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-5 text-center text-2xl font-semibold">
              Applications for: {selectedOffer.name}
            </h2>

            {loadingApplications ? (
              <div className="text-center text-xl">Loading applications...</div>
            ) : (
              <div className="space-y-6">
                {applications.map((app) => (
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
                              // disabled={app.status === 2} // Disable if the status is 'match' (2)
                            >
                              Match
                            </button>
                            <button
                              type="button"
                              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-400"
                              onClick={() => handlePass(selectedOffer, app)}
                              // disabled={app.status === 1} // Disable if the status is 'pass' (1)
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
                          <strong>Company:</strong>
                          <p>{app.freelancer?.company}</p>
                        </div>
                      )}

                      {app.freelancer?.description && (
                        <div className="mt-2">
                          <strong>Description:</strong>
                          <p>{app.freelancer?.description}</p>
                        </div>
                      )}

                      {app.freelancer?.skills &&
                        app.freelancer.skills.length > 0 && (
                          <div className="mt-2">
                            <strong>Skills:</strong>
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
                            className="my-5 block w-full rounded-md bg-freeland p-3 text-center font-bold text-white"
                          >
                            View PoW
                          </a>
                        </div>
                      )}

                      {app.additionalInfo && (
                        <div className="mt-2">
                          <strong>Additional Info:</strong>
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
              className="mx-auto mt-6 w-full rounded bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-500 focus:outline-none md:w-auto"
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
