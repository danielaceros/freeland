"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../../../libs/firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

// Define the types for Offer
interface Offer {
  id: string;
  userId: string; // To identify the user who created the offer
  name: string;
  description: string;
  createdAt: Date;
  fileUrl?: string; // Optional file URL
}

export default function Work() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // User state
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]); // State for job offers
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null); // Selected offer for modal
  const [modalOpen, setModalOpen] = useState(false); // Modal open state

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
        setUser(currentUser);
        await fetchOffers(); // Fetch all offers for display
      } else {
        console.log("No user is authenticated.");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to fetch job offers from Firestore (from all users)
  const fetchOffers = async () => {
    try {
      // Get all user documents
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      console.log("Users fetched:", usersSnapshot.docs.length); // Log the number of users

      const offersData: Offer[] = [];

      // Loop through each user document to get their offers
      for (const userDoc of usersSnapshot.docs) {
        const offersCollection = collection(userDoc.ref, 'offers');
        const offersSnapshot = await getDocs(offersCollection);

        console.log(`User ${userDoc.id} has ${offersSnapshot.docs.length} offers`); // Log offers count per user

        // Loop through each offer document for the user
        for (const offerDoc of offersSnapshot.docs) {
          offersData.push({
            id: offerDoc.id,
            userId: userDoc.id,
            name: offerDoc.data().name,
            description: offerDoc.data().description,
            createdAt: new Date(offerDoc.data().createdAt.seconds * 1000),
            fileUrl: offerDoc.data().fileUrl
          });
        }
      }

      setOffers(offersData); // Update the offers state
      console.log("Offers fetched:", offersData); // Log fetched offers
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to fetch offers.");
    }
  };

  // Function to open the modal with offer details
  const openModal = (offer: Offer) => {
    console.log("Opening modal for offer:", offer); // Log the selected offer
    setSelectedOffer(offer);
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedOffer(null);
    setModalOpen(false);
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
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer" onClick={() => router.push('/en/dashboard/hire')}>
              Hire
            </li>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer bg-green-600" onClick={() => router.push('/en/dashboard/work')}>
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
          <h2 className="text-3xl font-semibold">Active Job Offers</h2>
        </header>

        <main className="flex-1 p-6">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div>
              {user ? (
                <div>
                  <h3 className="text-xl font-semibold mb-4">All Active Job Offers</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {offers.length > 0 ? (
                      offers.map((offer) => (
                        <div
                          key={offer.id}
                          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                          onClick={() => openModal(offer)} // Open modal on offer click
                        >
                          <h4 className="text-lg font-semibold">{offer.name}</h4>
                          <p className="text-gray-600">{offer.description}</p>
                          <p className="text-gray-700">Posted on: {offer.createdAt.toLocaleDateString()}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-700">No active job offers available.</p>
                    )}
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
                </div>
              ) : (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">You must be logged in to see offers.</h3>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
