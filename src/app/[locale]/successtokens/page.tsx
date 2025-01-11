'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { auth } from '@/libs/firebase';

const db = getFirestore();

const SuccessPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [tokensAdded, setTokensAdded] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSuccess = async (tokens: number) => {
    if (user) {
      try {
        const userDoc = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          const newTokenCount = (userSnap.data().tokens || 0) + tokens;
          await updateDoc(userDoc, { tokens: newTokenCount });

          setTokensAdded(tokens);
        } else {
          console.error('User not found in Firestore');
        }
      } catch (error) {
        console.error('Error updating tokens:', error);
      }
    }

    setLoading(false);
    setTimeout(() => {
      router.push('/');
    }, 300);
  };

  useEffect(() => {
    if (!isClient) return;

    const tokens = new URLSearchParams(window.location.search).get('tokens');

    if (tokens && user) {
      handleSuccess(parseInt(tokens, 16));
    } else {
      console.error('Tokens or user data is missing.');
    }
  }, [user, isClient, router]);

  return (
    <div>
      {loading ? (
        <div>Processing your payment...</div>
      ) : (
        <div>
          <p>Payment successful!</p>
          <p>{tokensAdded} tokens have been added to your account.</p>
          <p>Redirecting to home...</p>
        </div>
      )}
    </div>
  );
};

export default SuccessPage;
