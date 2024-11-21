'use client';
import { v4 as uuidv4 } from 'uuid';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Menu from '@/components/common/Menu';

import { auth, db, storage } from '../../../../libs/firebase';

// Define the types for Offer and User
interface Offer {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  fileUrl?: string; // Optional file URL
}

export default function Hire() {
  const [user, setUser] = useState<User | null>(null); // User state
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]); // State for job offers
  const [offerName, setOfferName] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerFile, setOfferFile] = useState<File | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null); // Selected offer for modal
  const [modalOpen, setModalOpen] = useState(false); // Modal open state
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // Confirmation modal state
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null); // Offer ID to delete

  // Function to fetch job offers from Firestore
  const fetchOffers = async (uid: string) => {
    const offersCollection = collection(db, 'users', uid, 'offers');
    const q = query(offersCollection, orderBy('createdAt', 'desc'));

    try {
      const querySnapshot = await getDocs(q);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const offersData: Offer[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        createdAt: new Date(doc.data().createdAt.seconds * 1000), // Convert Firestore timestamp to Date
        fileUrl: doc.data().fileUrl, // Get the file URL if exists
      }));
      setOffers(offersData); // Update the offers state
    } catch (error) {
      toast.error('Failed to fetch offers.');
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
      setLoading(false); // Set loading to false after checking user state
    });

    return () => unsubscribe();
  }, []);

  // Function to handle adding a new job offer
  const handleAddOffer = async () => {
    if (!offerName || !offerDescription || !offerFile) {
      toast.error('Please fill in all fields and upload a file.');
      return;
    }
  
    try {
      // Generate a random offer ID
      const offerId = uuidv4();  // Generates a unique random ID for the offer
  
      // Upload the file to Firebase Storage under the user's UID and offer ID
      const storageRef = ref(storage, `offers/${user!.uid}/${offerId}/recruiter/${offerFile.name}`); // Include the offerId here
      await uploadBytes(storageRef, offerFile);
      const fileUrl = await getDownloadURL(storageRef); // Get the download URL of the uploaded file
  
      // Add the offer to Firestore under the user's UID and offerId
      await setDoc(doc(db, 'users', user!.uid, 'offers', offerId), {
        name: offerName,
        description: offerDescription,
        createdAt: new Date(),
        fileUrl, // Store the file URL in Firestore
      });
  
      toast.success('Offer added successfully!');
      
      // Reset the form and fetch updated offers
      setOfferName('');
      setOfferDescription('');
      setOfferFile(null);
      fetchOffers(user!.uid); // Fetch the updated offers
    } catch (error) {
      console.error('Error adding offer:', error);
      toast.error('Failed to add offer.');
    }
  };

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
      toast.success('Offer deleted successfully!');
      fetchOffers(user!.uid); // Fetch updated offers after deletion
      closeConfirmDeleteModal(); // Close the confirmation modal
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast.error('Failed to delete offer.');
    }
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex h-full items-center justify-center">
      <div className="size-16 animate-spin rounded-full border-y-4 border-green-600" />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Menu />

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between bg-white p-4 shadow">
          <h2 className="text-3xl font-semibold">Hire</h2>
          <button
            type="button"
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500"
            onClick={handleAddOffer}
          >
            Add New Offer
          </button>
        </header>

        <main className="flex-1 p-6">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div>
              {user ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold">
                      Create a New Job Offer
                    </h3>
                    <div className="mb-4">
                      <p className="block text-gray-700">Offer Name</p>
                      <input
                        type="text"
                        value={offerName}
                        onChange={(e) => setOfferName(e.target.value)}
                        className="w-full rounded border border-gray-300 p-2"
                      />
                    </div>
                    <div className="mb-4">
                      <p className="block text-gray-700">Description</p>
                      <textarea
                        value={offerDescription}
                        onChange={(e) => setOfferDescription(e.target.value)}
                        className="w-full rounded border border-gray-300 p-2"
                      />
                    </div>
                    <div className="mb-4">
                      <p className="block text-gray-700">Upload File</p>
                      <input
                        type="file"
                        onChange={(e) =>
                          setOfferFile(e.target.files?.[0] || null)
                        }
                        className="w-full rounded border border-gray-300 p-2"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddOffer}
                      className="mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500"
                    >
                      Add Offer
                    </button>
                  </div>

                  <h3 className="mb-4 text-xl font-semibold">
                    Your Job Offers
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl"
                      >
                        <h4 className="text-lg font-semibold">{offer.name}</h4>
                        <p className="text-gray-600">{offer.description}</p>
                        <p className="text-gray-700">
                          Posted on: {offer.createdAt.toLocaleDateString()}
                        </p>
                        <div className="mt-4 flex justify-between">
                          <button
                            type="button"
                            onClick={() => openModal(offer)} // Open modal on offer click
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() => openConfirmDeleteModal(offer.id)} // Open confirmation modal
                            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Modal for offer details */}
                  {modalOpen && selectedOffer && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold">
                          {selectedOffer.name}
                        </h2>
                        <p className="mb-4">{selectedOffer.description}</p>
                        <p className="text-gray-700">
                          Posted on:{' '}
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
                              View Uploaded File
                            </a>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={closeModal}
                          className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirmation Modal for Deletion */}
                  {confirmDeleteOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold">
                          Confirm Deletion
                        </h2>
                        <p>Are you sure you want to delete this offer?</p>
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={closeConfirmDeleteModal}
                            className="mr-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteOffer}
                            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">
                    You must be logged in to see your offers.
                  </h3>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
