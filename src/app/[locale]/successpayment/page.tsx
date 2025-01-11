'use client';

import { addDoc, collection } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../../../libs/firebase';

const SuccessPayment = () => {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messageSent, setMessageSent] = useState(false);
  const [amount, setAmount] = useState<string | null>(null);
  const [chatid, setChatid] = useState<string | null>(null);
  const [sender, setSender] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);

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
    if (messageSent || !isClient) return;

    if (!amount || !chatid) {
      console.error('Missing amount or chatid');
      return;
    }

    const amountNumber = parseFloat(amount);
    const chatIdString = chatid;

    if (Number.isNaN(amountNumber) || !chatIdString) {
      console.error('Invalid amount or chatid');
      return;
    }

    const sendPaymentMessage = async () => {
      try {
        const message = `I sent you ${amountNumber}€ for the freelance service.`;

        const messagesRef = collection(db, 'chats', chatIdString, 'messages');

        await addDoc(messagesRef, {
          senderId: sender,
          message,
          createdAt: new Date(),
        });

        console.log('Payment message sent to chat!');
        setMessageSent(true);
      } catch (error) {
        console.error('Error sending payment message:', error);
      } finally {
        setLoading(false);
      }
    };

    sendPaymentMessage();
  }, [amount, chatid, messageSent, sender, isClient]);

  useEffect(() => {
    if (!loading && isClient) {
      const timer = setTimeout(() => {
        window.location.href =
          process.env.NODE_ENV === 'production'
            ? 'https://freeland-phi.vercel.app/'
            : 'http://localhost:3000/';
      }, 300);
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
