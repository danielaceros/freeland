import { deleteDoc, doc } from 'firebase/firestore';
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

const ViewUserHire = (props: ViewUserHireProps) => {
  const { user, offers, onFetchOffers, onEditOffer } = props;
  const t = useTranslations(); // Initialize translations

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null); // Selected offer for modal
  const [modalOpen, setModalOpen] = useState(false); // Modal open state
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // Confirmation modal state
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null); // Offer ID to delete

  // Function to open the modal with offer details
  const openModal = (offer: Offer) => {
    setSelectedOffer(offer);
    setModalOpen(true);
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
              onLike={() => openModal(offer)}
              onStarRating={() => openModal(offer)}
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
