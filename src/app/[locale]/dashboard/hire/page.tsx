"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '../../../../libs/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Define the types for Offer and User
interface Offer {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  fileUrl?: string; // Optional file URL
}

export default function Hire() {
  const router = useRouter();
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

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success(`¡Adios!, ${user?.email}`);
      router.push('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión.");
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

  // Function to fetch job offers from Firestore
  const fetchOffers = async (uid: string) => {
    const offersCollection = collection(db, 'users', uid, 'offers');
    const q = query(offersCollection, orderBy('createdAt', 'desc'));

    try {
      const querySnapshot = await getDocs(q);
      const offersData: Offer[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        createdAt: new Date(doc.data().createdAt.seconds * 1000), // Convert Firestore timestamp to Date
        fileUrl: doc.data().fileUrl // Get the file URL if exists
      }));
      setOffers(offersData); // Update the offers state
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to fetch offers.");
    }
  };

  // Function to handle adding a new job offer
  const handleAddOffer = async () => {
    if (!offerName || !offerDescription || !offerFile) {
      toast.error("Please fill in all fields and upload a file.");
      return;
    }

    try {
      // Upload file to Firebase Storage in a user-specific path
      const storageRef = ref(storage, `offers/${user!.uid}/${offerFile.name}`); // Change this line
      await uploadBytes(storageRef, offerFile);
      const fileUrl = await getDownloadURL(storageRef); // Get the download URL of the uploaded file

      // Add the offer to Firestore
      await addDoc(collection(db, 'users', user!.uid, 'offers'), {
        name: offerName,
        description: offerDescription,
        createdAt: new Date(),
        fileUrl: fileUrl // Store the file URL in Firestore
      });
      toast.success("Offer added successfully!");
      setOfferName('');
      setOfferDescription('');
      setOfferFile(null);
      fetchOffers(user!.uid); // Fetch the updated offers
    } catch (error) {
      console.error("Error adding offer:", error);
      toast.error("Failed to add offer.");
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
      toast.success("Offer deleted successfully!");
      fetchOffers(user!.uid); // Fetch updated offers after deletion
      closeConfirmDeleteModal(); // Close the confirmation modal
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error("Failed to delete offer.");
    }
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 border-b-4"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-green-800 text-white p-4">
        {user ? (
          <h1 className="text-xl font-bold mb-6">¡Welcome, {user.email?.split("@")[0]}!</h1>
        ) : (
          <h1 className="text-xl font-bold mb-6"></h1>
        )}
        <nav>
          <ul>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer" onClick={() => router.push('/en/dashboard')}>
              Dashboard
            </li>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer bg-green-600" onClick={() => router.push('/en/dashboard/hire')}>
              Hire
            </li>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer" onClick={() => router.push('/en/dashboard/work')}>
              Work
            </li>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer" onClick={() => router.push('/en/dashboard/profile')}>
              Profile
            </li>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer" onClick={handleLogout}>
              Logout
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white p-4 shadow">
          <h2 className="text-3xl font-semibold">Hire</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500" onClick={handleAddOffer}>
            Add New Offer
          </button>
        </header>

        <main className="flex-1 p-6">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div>
              {user ? (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold">Create a New Job Offer</h3>
                    <div className="mb-4">
                      <label className="block text-gray-700">Offer Name</label>
                      <input
                        type="text"
                        value={offerName}
                        onChange={(e) => setOfferName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Description</label>
                      <textarea
                        value={offerDescription}
                        onChange={(e) => setOfferDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Upload File</label>
                      <input
                        type="file"
                        onChange={(e) => setOfferFile(e.target.files?.[0] || null)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <button
                      onClick={handleAddOffer}
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                    >
                      Add Offer
                    </button>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">Your Job Offers</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                      >
                        <h4 className="text-lg font-semibold">{offer.name}</h4>
                        <p className="text-gray-600">{offer.description}</p>
                        <p className="text-gray-700">Posted on: {offer.createdAt.toLocaleDateString()}</p>
                        <div className="flex justify-between mt-4">
                          <button
                            onClick={() => openModal(offer)} // Open modal on offer click
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => openConfirmDeleteModal(offer.id)} // Open confirmation modal
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
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
                      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">{selectedOffer.name}</h2>
                        <p className="mb-4">{selectedOffer.description}</p>
                        <p className="text-gray-700">Posted on: {selectedOffer.createdAt.toLocaleDateString()}</p>
                        {selectedOffer.fileUrl && (
                          <div className="mt-4">
                            <a href={selectedOffer.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                              View Uploaded File
                            </a>
                          </div>
                        )}
                        <button onClick={closeModal} className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500">
                          Close
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirmation Modal for Deletion */}
                  {confirmDeleteOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this offer?</p>
                        <div className="flex justify-end mt-4">
                          <button onClick={closeConfirmDeleteModal} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400">
                            Cancel
                          </button>
                          <button onClick={handleDeleteOffer} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">You must be logged in to see your offers.</h3>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
