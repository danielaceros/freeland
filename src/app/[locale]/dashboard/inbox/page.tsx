"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use useRouter from next/navigation
import { db, auth } from "@/libs/firebase"; // Firebase configuration
import { collection, getDocs, query, where } from "firebase/firestore"; // Firestore query and fetch
import { onAuthStateChanged } from "firebase/auth"; // Firebase Auth function to track user state

const InboxPage = () => {
  const router = useRouter();
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
    router.push(`/dashboard/chat/${chatId}`); // Redirect to the selected chat
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-500">Cargando...</div>;
  }

  if (!userId) {
    return <div className="text-center text-lg text-gray-500">Por favor inicia sesión para ver tus chats.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Inbox</h1>

      {/* List of chats */}
      <div className="space-y-4">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.id}
              className="p-4 bg-gray-100 rounded-md shadow-md cursor-pointer hover:bg-gray-200"
              onClick={() => handleChatClick(chat.id)}
            >
              <h2 className="text-xl font-medium text-gray-800">Chat ID: {chat.id}</h2>
              <p className="text-gray-700">
                <strong>Participantes:</strong> {chat.participants?.join(", ")}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Creado en:</strong> {new Date(chat.createdAt?.seconds * 1000).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No tienes chats abiertos.</p>
        )}
      </div>
    </div>
  );
};

export default InboxPage;
