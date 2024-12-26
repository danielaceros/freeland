'use client';

import { addDoc, collection } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../../../libs/firebase';

const SuccessPayment = () => {
  const [isClient, setIsClient] = useState(false); // Track if the component is on the client
  const [loading, setLoading] = useState(true);
  const [messageSent, setMessageSent] = useState(false); // Flag to track if the message was sent
  const [amount, setAmount] = useState<string | null>(null); // Cambiar el tipo a string | null
  const [chatid, setChatid] = useState<string | null>(null); // Cambiar el tipo a string | null
  const [sender, setSender] = useState<string | null>(null);

  useEffect(() => {
    // Set isClient to true once the component is mounted
    setIsClient(true);

    // Extract URL parameters only on the client
    if (isClient) {
      const amountFromUrl = new URLSearchParams(window.location.search).get(
        'amount',
      );
      const chatidFromUrl = new URLSearchParams(window.location.search).get(
        'chatid',
      );
      const senderFromUrl = new URLSearchParams(window.location.search).get(
        'sender',
      );

      setAmount(amountFromUrl);
      setChatid(chatidFromUrl);
      setSender(senderFromUrl);
    }
  }, [isClient]);

  useEffect(() => {
    // If the message has been sent, do nothing
    if (messageSent || !isClient) return;

    // Validate parameters
    if (!amount || !chatid) {
      console.error('Missing amount or chatid');
      return;
    }

    const amountNumber = parseFloat(amount);
    const chatIdString = chatid;

    // If amount is not valid or chatId is empty, return
    if (Number.isNaN(amountNumber) || !chatIdString) {
      console.error('Invalid amount or chatid');
      return;
    }

    // Function to send a payment message to the chat
    const sendPaymentMessage = async () => {
      try {
        // Message content
        const message = `I sent you ${amountNumber}€ for the freelance service.`;

        // Reference to the chat messages (assuming you know the chatId)
        const messagesRef = collection(db, 'chats', chatIdString, 'messages');

        // Add the message to Firestore
        await addDoc(messagesRef, {
          senderId: sender, // Sender's ID (could be user who initiated the payment)
          message,
          createdAt: new Date(),
        });

        console.log('Payment message sent to chat!');
        setMessageSent(true); // Mark message as sent
      } catch (error) {
        console.error('Error sending payment message:', error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    // Call the function to send the message
    sendPaymentMessage();
  }, [amount, chatid, messageSent, sender, isClient]); // Depend on isClient to ensure client-side execution

  // Redirect the user after 0.3 seconds
  useEffect(() => {
    if (!loading && isClient) {
      const timer = setTimeout(() => {
        window.location.href =
          process.env.NODE_ENV === 'production'
            ? 'https://freeland-phi.vercel.app/'
            : 'http://localhost:3000/';
      }, 300); // Redirect after 0.3 seconds

      // Cleanup timer on component unmount
      // return () => clearTimeout(timer);
      clearTimeout(timer);
    }
  }, [loading, isClient]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-center">
      <h1>Payment Successful</h1>
      <p>Thank you for your payment! You will be redirected shortly.</p>
    </div>
  );
};

export default SuccessPayment;
