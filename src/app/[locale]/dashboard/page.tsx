"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import { auth } from '../../../libs/firebase'; // Ensure this path is correct to your Firebase setup
import { signOut } from 'firebase/auth'; // Import signOut method
import { toast } from 'react-toastify';
import { onAuthStateChanged, User } from 'firebase/auth'; // Import onAuthStateChanged and User

export default function Dashboard() {
  const router = useRouter(); // Get router instance
  const [user, setUser] = useState<User | null>(null); // Specify the state type as User or null
  const [loading, setLoading] = useState(true); // Loading state


  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      toast.success("¡Adios!, " + user?.email);
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión."); // Show error message
    }
  };

  // Effect to retrieve current user information
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user state if user is logged in
      } else {
        setUser(null); // No user logged in
      }
      setLoading(false); // Set loading to false after checking user state
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 border-b-4"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar */}
      <aside className="w-64 bg-green-800 text-white p-4">
        {user ? ( // Check if the user is available
          <h1 className="text-xl font-bold mb-6">¡Welcome, {user.email?.split("@")[0]}!</h1>
        ) : (
          <h1 className="text-xl font-bold mb-6"></h1>
        )} {/* Display user's email */}
        <nav>
        <ul>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer bg-green-600" onClick={() => router.push('/en/dashboard')}>
              Dashboard
            </li>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer" onClick={() => router.push('/en/dashboard/hire')}>
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

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-4 shadow">
          <h2 className="text-3xl font-semibold">Dashboard</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500">
            Add New
          </button>
        </header>

        {/* Content area */}
        <main className="flex-1 p-6">
          {loading ? ( // Show loading spinner while loading
            <LoadingSpinner />
          ) : (
            <div>
              {user ? ( // Show user information if available
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">¡Welcome, {user.displayName || user.email}!</h3>
                </div>
              ) : (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold"></h3>
                </div>
              )}

              <div className="grid grid-cols-3 gap-6 mb-6">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-semibold">Total Sales</h3>
                  <p className="text-3xl text-green-600">$10,000</p>
                  <p className="text-gray-600">+15% from last month</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-semibold">Active Users</h3>
                  <p className="text-3xl text-green-600">1,250</p>
                  <p className="text-gray-600">+30% from last month</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-semibold">New Signups</h3>
                  <p className="text-3xl text-green-600">300</p>
                  <p className="text-gray-600">+20% from last month</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Card 4 */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-semibold">Latest Activity</h3>
                  <ul className="mt-2">
                    <li className="text-gray-700">User John signed up</li>
                    <li className="text-gray-700">User Jane made a purchase</li>
                    <li className="text-gray-700">User Alex logged in</li>
                    <li className="text-gray-700">User Mary updated profile</li>
                  </ul>
                </div>

                {/* Card 5 */}
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-semibold">Revenue Overview</h3>
                  <p className="text-green-600 text-3xl">$2,500</p>
                  <p className="text-gray-600">This week</p>
                  <div className="mt-4">
                    <div className="bg-green-200 h-4 rounded" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
