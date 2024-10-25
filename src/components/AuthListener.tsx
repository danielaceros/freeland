// AuthListener.js
"use client"
import { useEffect } from 'react';
import { auth } from '../libs/firebase'; // Adjust the path as necessary
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const AuthListener = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        
        if (router) {
          router.push('');
        }
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [auth, router]);

  return null; // You can return a loading state or null
};

export default AuthListener;
