import { auth, db } from '@/libs/firebase';
import { openChat } from '@/store/chatStore';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

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
        const chatsRef = collection(db, "chats");
        const q = query(chatsRef, where("participants", "array-contains", userId));
        const querySnapshot = await getDocs(q);
        const chatsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(chatsList); // Set the fetched chats
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]); // Run fetchChats when userId changes
 
  // Handle chat click
  const handleChatClick = (chatId: string) => {
    const data = {id: chatId, open: true}
    dispatch(openChat(data));
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-500">Cargando...</div>;
  }

  if (!userId) {
    return <div className="text-center text-lg text-gray-500">Por favor inicia sesión para ver tus chats.</div>;
  }

  return (
      <div className="space-y-4 mt-16 pb-3 pt-1 px-1 bg-zinc-700 rounded-md">
        <div className='font-bold bg-zinc-800 rounded-md text-center p-2'>
          <h2>Freelancers</h2>
        </div>
        
        {chats.length > 0 ? (
          chats.map((chat) => {
            const userFreeland = chat.freelanceCreateOffer.id !== userId ? chat.freelanceCreateOffer : chat.freelancer;
            return(
              <div
                key={chat.id}
                className="p-4 bg-gray-100 rounded-md shadow-md cursor-pointer hover:bg-gray-200 flex items-center space-x-3"
                onClick={() => handleChatClick(chat.id)}
              >
                <div>
                  <img
                    src={userFreeland.profilePicture}
                    className="w-12 h-10 rounded-full border-2 border-green-600"
                  />
                </div>
                <div>
                  <p className="text-gray-700 leading-none">
                    <strong>{userFreeland.user}</strong>
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <div className='text-center'>
            <p>no hay chat</p>
          </div>
        )
        }
      </div>
  );
}

export default ViewUsersChat
