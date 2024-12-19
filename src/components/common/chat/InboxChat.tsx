import { db } from "@/libs/firebase";
import { sortedDates } from "@/utils/utils";
import { type DocumentData, doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

interface InboxChatProps {
  chatId: string,
  load:boolean
}
const InboxChat = (props: InboxChatProps) => {
  const { chatId } = props;  // Get the chatId from URL params
  const profileData = useSelector((state: any) => state.user.userData);
  // Define state for chat data and messages
  const [chatData, setChatData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]); // Store chat messages

  // Fetch chat data from Firebase
  useEffect(() => {
    if (!chatId) return; // Ensure chatId exists before fetching data

    const fetchChatData = async () => {
      try {
        const chatRef = doc(db, 'chats', chatId as string);
        const chatSnapshot = await getDoc(chatRef);

        if (chatSnapshot.exists()) {
          setChatData(chatSnapshot.data());
        } else {
          console.error('Chat not found');
        }

        // Fetch messages for this chat
        const messagesRef = collection(db, 'chats', chatId as string, 'messages');
        const messagesSnapshot = await getDocs(messagesRef);
        const messagesList = messagesSnapshot.docs.map(docu => docu.data());
        setMessages(sortedDates(messagesList, 'createdAt', 'DESC'));
        
      } catch (error) {
        console.error('Error fetching chat data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChatData();
  }, [chatId]); // Run effect when chatId changes

  // Handle sending new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return; // Don't send empty messages

    try {
      const messagesRef = collection(db, 'chats', chatId as string, 'messages');
      await addDoc(messagesRef, {
        senderId: profileData.uid, // Replace with actual userId
        message: newMessage,
        createdAt: new Date(),
      });

      // Add the new message to the state
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: profileData.uid, message: newMessage, createdAt: new Date() },
      ]);
      setNewMessage(''); // Clear input field
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-500">Cargando...</div>;
  }

  return (
    <>
    {chatData &&
      <div className="w-full bg-zinc-800 p-6 flex space-x-3 items-center">
        <img
          src={chatData.freelanceCreateOffer.id === profileData.uid ? chatData.freelancer.profilePicture : chatData.freelanceCreateOffer.profilePicture}
          className="size-12 rounded-full border-2 border-green-600"
        />
        <h2 className="text-2xl text-freeland font-bold">{chatData.freelanceCreateOffer.id === profileData.uid ? chatData.freelancer.user : chatData.freelanceCreateOffer.user}</h2>
      </div>
    }
    
    <div className="mx-auto rounded-lg space-y-6">

      {/* Messages Section */}
      <div className="overflow-y-auto p-4 rounded-md shadow-md space-y-4" style={{ height: "calc(68vh)" }}>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.senderId === profileData.uid ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg text-sm shadow-md ${message.senderId === profileData.uid ? 'bg-zinc-700 text-white' : 'bg-gray-300 text-gray-800'}`}
              >
                <p>{message.message}</p>
                <span className="text-xs text-gray-500">{new Date(message.createdAt.seconds * 1000).toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No hay mensajes aún...</p>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex items-center space-x-4 px-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-grow px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-6 py-2 text-white bg-freeland rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Enviar
        </button>
      </form>
    </div>
    </>
  );
}

export default InboxChat
