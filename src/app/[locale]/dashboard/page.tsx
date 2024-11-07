'use client';

import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged and User
import { useEffect, useState } from 'react';

import Menu from '@/components/common/Menu';

import { auth } from '../../../libs/firebase'; // Ensure this path is correct to your Firebase setup

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null); // Specify the state type as User or null
  const [loading, setLoading] = useState(true); // Loading state

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
    <div className="flex h-full items-center justify-center">
      <div className="size-16 animate-spin rounded-full border-y-4 border-green-600" />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Menu />

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white p-4 shadow">
          <h2 className="text-3xl font-semibold">Dashboard</h2>
          <div className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500">
            Add New
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-6">
          {loading ? ( // Show loading spinner while loading
            <LoadingSpinner />
          ) : (
            <div>
              {user && ( // Show user information if available
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">
                    ¡Welcome, {user.displayName || user.email}!
                  </h3>
                </div>
              )}

              <div className="mb-6 grid grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
                  <h3 className="text-lg font-semibold">Total Sales</h3>
                  <p className="text-3xl text-green-600">$10,000</p>
                  <p className="text-gray-600">+15% from last month</p>
                </div>

                {/* Card 2 */}
                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
                  <h3 className="text-lg font-semibold">Active Users</h3>
                  <p className="text-3xl text-green-600">1,250</p>
                  <p className="text-gray-600">+30% from last month</p>
                </div>

                {/* Card 3 */}
                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
                  <h3 className="text-lg font-semibold">New Signups</h3>
                  <p className="text-3xl text-green-600">300</p>
                  <p className="text-gray-600">+20% from last month</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Card 4 */}
                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
                  <h3 className="text-lg font-semibold">Latest Activity</h3>
                  <ul className="mt-2">
                    <li className="text-gray-700">User John signed up</li>
                    <li className="text-gray-700">User Jane made a purchase</li>
                    <li className="text-gray-700">User Alex logged in</li>
                    <li className="text-gray-700">User Mary updated profile</li>
                  </ul>
                </div>

                {/* Card 5 */}
                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
                  <h3 className="text-lg font-semibold">Revenue Overview</h3>
                  <p className="text-3xl text-green-600">$2,500</p>
                  <p className="text-gray-600">This week</p>
                  <div className="mt-4">
                    <div
                      className="h-4 rounded bg-green-200"
                      style={{ width: '75%' }}
                    />
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
