"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Use useParams from next/navigation
import { db } from '@/libs/firebase'; // Firebase configuration
import { doc, getDoc, DocumentData, collection, getDocs, addDoc } from 'firebase/firestore';

const ChatPage = () => {
  const { chatId } = useParams();  // Get the chatId from URL params

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
        const messagesList = messagesSnapshot.docs.map(doc => doc.data());
        setMessages(messagesList);
        
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
        senderId: 'userId', // Replace with actual userId
        message: newMessage,
        createdAt: new Date(),
      });

      // Add the new message to the state
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: 'userId', message: newMessage, createdAt: new Date() },
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Chat ID: {chatId}</h1>
      
      {/* Chat Info */}
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        <p className="text-lg text-gray-700"><strong>Participantes:</strong> {chatData?.participants?.join(', ')}</p>
        <p className="text-sm text-gray-500"><strong>Creado en:</strong> {new Date(chatData?.createdAt?.seconds * 1000).toLocaleString()}</p>
      </div>

      {/* Messages Section */}
      <div className="h-96 overflow-y-auto bg-gray-50 p-4 rounded-md shadow-md space-y-4">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.senderId === 'userId' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg text-sm shadow-md ${message.senderId === 'userId' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}
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
      <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-grow px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
