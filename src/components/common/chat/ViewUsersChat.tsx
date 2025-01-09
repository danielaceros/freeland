import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { auth, db } from '@/libs/firebase';
import { openChat } from '@/store/chatStore';

const ViewUsersChat = () => {
  const dispatch = useDispatch();

  const [chats, setChats] = useState<any[]>([]); // State to store chat list
  const [loading, setLoading] = useState(true);
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

  // Fetch chats if userId is available
  useEffect(() => {
    const fetchChats = async () => {
      if (!userId) return; // Do nothing if userId is not available

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
        setChats(chatsList); // Set the fetched chats
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]); // Run fetchChats when userId changes

  // Handle chat click
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
      {/* <div className="rounded-md bg-zinc-800 p-2 text-center font-bold">
        <h2>Freelancers</h2>
      </div> */}
      <div className="">
        {chats.length > 0 ? (
          chats.map((chat) => {
            // Check if freelanceCreateOffer and freelancer exist before accessing them
            const userFreeland =
              chat?.freelanceCreateOffer?.id !== userId
                ? chat?.freelanceCreateOffer
                : chat?.freelancer;

            // Check if userFreeland exists
            if (!userFreeland) {
              return null; // Skip rendering if no userFreeland found
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
