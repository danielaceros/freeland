'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

import BarTop from '@/components/common/BarTop';
import PanelChat from '@/components/common/chat/PanelChat';
import ViewUsersChat from '@/components/common/chat/ViewUsersChat';
import Menu from '@/components/common/Menu';
import { auth } from '@/libs/firebase';

const InboxPage = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
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
