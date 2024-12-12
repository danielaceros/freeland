'use client';

import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import type { ProfileDataInterface } from '@/app/[locale]/dashboard/profile/page';
import { auth, db } from '@/libs/firebase';

interface UseUserResult {
  userData: User | null;
  profileData: ProfileDataInterface;
  hasLoaded: boolean;
}

export function useUser(): UseUserResult {
  const [userData, setUser] = useState<User | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [profileData, setProfileData] = useState<{
    name: string;
    surname: string | null;
    email: string | null;
    nick: string | null;
    profilePicture: string | null;
    profilePictureBackground: string | null;
    position: string;
    phone: string;
    skills: string[];
    history: [];
    certi: [];
  }>({
    name: '',
    surname: '',
    email: '',
    nick: '',
    profilePicture: null,
    profilePictureBackground: null,
    position: '',
    phone: '',
    skills: [],
    history: [],
    certi: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfileData({
              name: data.name || '',
              surname: data.surname || '',
              email: data.email || currentUser.email,
              nick: data.nick || '',
              profilePicture: data.profilePicture || null,
              profilePictureBackground: data.profilePictureBackground || null,
              position: data.position || '',
              phone: data.phone || '',
              skills: data.skills || null,
              history: data.history || null,
              certi: data.certi || null,
            });
          } else {
            await setDoc(userDocRef, { email: currentUser.email });
            setProfileData({
              name: '',
              surname: '',
              email: currentUser.email,
              nick: '',
              profilePicture: null,
              profilePictureBackground: null,
              position: '',
              phone: '',
              skills: [],
              history: [],
              certi: [],
            });
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
          toast.error('Failed to load profile data.'); // Notify on error
        }
        setHasLoaded(true);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { userData, profileData, hasLoaded };
}
