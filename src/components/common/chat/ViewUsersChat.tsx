import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { auth, db } from '@/libs/firebase';
import { openChat } from '@/store/chatStore';

const ViewUsersChat = () => {
  const dispatch = useDispatch();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchChats = async () => {
      if (!userId) return;

      try {
        const chatsRef = collection(db, 'chats');
        const q = query(
          chatsRef,
          where('participants', 'array-contains', userId),
        );
        const querySnapshot = await getDocs(q);
        const chatsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(chatsList);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]);

  const handleChatClick = (chatId: string) => {
    const data = { id: chatId, open: true };
    dispatch(openChat(data));
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-500">Cargando...</div>;
  }

  if (!userId) {
    return (
      <div className="text-center text-lg text-gray-500">
        Por favor inicia sesión para ver tus chats.
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-4 rounded-md bg-zinc-200 p-1">
      <div className="">
        {chats.length > 0 ? (
          chats.map((chat) => {
            const userFreeland =
              chat?.freelanceCreateOffer?.id !== userId
                ? chat?.freelanceCreateOffer
                : chat?.freelancer;

            if (!userFreeland) {
              return null;
            }

            return (
              <button
                type="button"
                key={chat.id}
                className="my-2 flex w-full cursor-pointer items-center space-x-3 rounded-md bg-gray-100 p-4 shadow-md hover:bg-gray-200"
                onClick={() => handleChatClick(chat.id)}
              >
                <div>
                  <img
                    src={userFreeland.profilePicture}
                    className="h-10 w-12 rounded-full border-2 border-green-600"
                  />
                </div>
                <div>
                  <p className="text-left leading-none text-gray-700">
                    <strong>{userFreeland.user}</strong>
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center">
            <p>no hay chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUsersChat;
