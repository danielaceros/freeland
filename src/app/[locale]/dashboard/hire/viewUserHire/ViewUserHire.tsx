import { deleteDoc, doc } from 'firebase/firestore';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { db } from '@/libs/firebase';

import type { Offer } from '../page';

interface ViewUserHireProps {
  user: any;
  onFetchOffers: (updateOffers: string) => void;
  offers: Offer[];
}

const ViewUserHire = (props: ViewUserHireProps) => {
  const { user, offers, onFetchOffers } = props;
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

  // Function to open the delete confirmation modal
  const openConfirmDeleteModal = (offerId: string) => {
    setOfferToDelete(offerId);
    setConfirmDeleteOpen(true);
  };

  // Function to close the delete confirmation modal
  const closeConfirmDeleteModal = () => {
    setOfferToDelete(null);
    setConfirmDeleteOpen(false);
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
  console.log('selectedOffer', selectedOffer);
  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold">{t('hire.yourJobOffers')}</h3>
      <div className="flex flex-wrap">
        {offers.map((offer) => (
          <div key={offer.id} className="w-4/12 cursor-pointer p-3">
            <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
              <h4 className="text-lg font-semibold">{offer.name}</h4>
              <p className="text-gray-600">{offer.description}</p>
              <p className="text-gray-700">
                {t('hire.postedOn')} {offer.createdAt.toLocaleDateString()}
              </p>
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => openModal(offer)} // Open modal on offer click
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
                >
                  {t('hire.viewDetails')}
                </button>
                <button
                  type="button"
                  onClick={() => openConfirmDeleteModal(offer.id)} // Open confirmation modal
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                >
                  {t('hire.delete')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for offer details */}
      {modalOpen && selectedOffer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">{selectedOffer.name}</h2>
            <p className="mb-4">{selectedOffer.description}</p>
            <p className="text-gray-700">
              {t('hire.postedOn')}{' '}
              {selectedOffer.createdAt.toLocaleDateString()}
            </p>
            {selectedOffer.fileUrl && (
              <div className="mt-4">
                <a
                  href={selectedOffer.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {t('hire.viewUploadedFile')}
                </a>
              </div>
            )}
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
