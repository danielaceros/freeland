import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '@/libs/firebase';
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { sortedDates } from '@/utils/utils';

interface InboxChatProps {
  chatId: string;
}

const InboxChat = (props: InboxChatProps) => {
  const { chatId } = props;
  const profileData = useSelector((state: any) => state.user.userData);

  // Define state for chat data, messages, and payment visibility
  const [chatData, setChatData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Show modal for payment
  const [offerAmount, setOfferAmount] = useState<string>(''); // State to store the offer amount

  // Fetch chat data from Firebase
  useEffect(() => {
    if (!chatId) return;

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
        const messagesList = messagesSnapshot.docs.map((docu) => docu.data());
        setMessages(sortedDates(messagesList, 'createdAt', 'DESC'));
      } catch (error) {
        console.error('Error fetching chat data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChatData();
  }, [chatId]);

  // Handle sending new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return; // Don't send empty messages

    try {
      const messagesRef = collection(db, 'chats', chatId as string, 'messages');
      await addDoc(messagesRef, {
        senderId: profileData.uid,
        message: newMessage,
        createdAt: new Date(),
      });

      // Add the new message to the state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: profileData.uid,
          message: newMessage,
          createdAt: new Date(),
        },
      ]);
      setNewMessage(''); // Clear input field
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handlePayment = async () => {
    // Check if the offer amount is valid
    if (!offerAmount || isNaN(Number(offerAmount)) || Number(offerAmount) <= 0) {
      alert('Please enter a valid offer amount.');
      return;
    }

    try {
      // Request the backend to create a Stripe Checkout session and get the payment URL
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(offerAmount), // Convert the amount to cents
          productName: 'Freelance Service',
          chatid: chatId,
          sender: profileData.uid
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        console.error('Error fetching payment URL:', error);
        alert('Payment failed!');
      } else {
        // Redirect the user to the Stripe Checkout page
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error during payment process:', error);
      alert('Payment failed!');
    }
  };

  // Show payment modal when the button is clicked
  const handleShowPayment = () => {
    setShowPaymentModal(true); // Set state to show the payment modal
  };

  // Close the modal when the user cancels
  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setOfferAmount(''); // Clear the input when closing the modal
  };

  if (loading) {
    return <div className="text-center text-lg text-gray-500">Cargando...</div>;
  }

  return (
    <>
      {chatData && (
        <div className="flex w-full items-center space-x-3 bg-zinc-800 p-6">
          <img
            src={
              chatData.freelanceCreateOffer.id === profileData.uid
                ? chatData.freelancer.profilePicture
                : chatData.freelanceCreateOffer.profilePicture
            }
            className="size-12 rounded-full border-2 border-green-600"
          />
          <h2 className="text-2xl font-bold text-freeland">
            {chatData.freelanceCreateOffer.id === profileData.uid
              ? chatData.freelancer.user
              : chatData.freelanceCreateOffer.user}
          </h2>
        </div>
      )}

      <div className="mx-auto space-y-6 rounded-lg">
        {/* Messages Section */}
        <div
          className="space-y-4 overflow-y-auto rounded-md p-4 shadow-md"
          style={{ height: 'calc(68vh)' }}
        >
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.senderId}
                className={`flex ${message.senderId === profileData.uid ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 text-sm shadow-md ${message.senderId === profileData.uid ? 'bg-zinc-700 text-white' : 'bg-gray-300 text-gray-800'}`}
                >
                  <p>{message.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(
                      message.createdAt.seconds * 1000,
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No hay mensajes aún...</p>
          )}
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-4 px-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="grow rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="rounded-md bg-freeland px-6 py-2 text-white hover:bg-blue-700 focus:outline-none"
          >
            Enviar
          </button>
          {/* Show payment modal when button is clicked */}
          <button
            type="button"
            onClick={handleShowPayment}
            className="rounded-md bg-freeland px-6 py-2 text-white hover:bg-blue-700 focus:outline-none"
          >
            Oferta
          </button>
        </form>
      </div>

      {/* Modal for payment */}
      {showPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-lg font-semibold text-center mb-4">Introduzca cantidad de la Oferta</h3>
            <input
              type="number"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              placeholder="Cantidad en EUR"
              className="w-full rounded-md border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleCloseModal}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none"
              >
                Pagar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InboxChat;
