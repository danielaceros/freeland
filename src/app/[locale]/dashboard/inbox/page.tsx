'use client';

import { onAuthStateChanged } from 'firebase/auth'; // Firebase Auth function to track user state
import { useEffect, useState } from 'react';

import BarTop from '@/components/common/BarTop';
import PanelChat from '@/components/common/chat/PanelChat';
import ViewUsersChat from '@/components/common/chat/ViewUsersChat';
import Menu from '@/components/common/Menu';
import { auth } from '@/libs/firebase'; // Firebase configuration

const InboxPage = () => {
  const [userId, setUserId] = useState<string | null>(null); // State to store the user ID

  // Fetch all chats for the current user
  useEffect(() => {
    // Track the current user's authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set the user ID if the user is logged in
      } else {
        setUserId(null); // Clear user ID if the user is logged out
      }
    });

    return () => unsubscribe(); // Clean up the listener when component unmounts
  }, []);

  if (!userId) {
    return (
      <div className="text-center text-lg text-gray-500">
        Por favor inicia sesión para ver tus chats.
      </div>
    );
  }

  return (
    <div className="flex max-h-screen overflow-y-hidden bg-gray-100">
      <Menu />
      <div className=" min-h-screen flex-1 overflow-y-scroll">
        <div className="flex flex-1 flex-col">
          <main className="flex-1 p-6 pt-20">
            <BarTop />
            <PanelChat />
            <ViewUsersChat />
          </main>
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
