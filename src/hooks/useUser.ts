import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { auth, db } from '@/libs/firebase';

interface ProfileData {
  name: string;
  surname: string | null;
  email: string | null;
  nick: string | null;
  profilePicture: string | null;
  position: string;
  phone: string;
  skills: string[];
}

interface UseUserResult {
  user: User | null;
  profileData: ProfileData;
  hasLoaded: boolean;
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [profileData, setProfileData] = useState<{
    name: string;
    surname: string | null;
    email: string | null;
    nick: string | null;
    profilePicture: string | null;
    position: string;
    phone: string;
    skills: string[];
  }>({
    name: '',
    surname: '',
    email: '',
    nick: '',
    profilePicture: null,
    position: '',
    phone: '',
    skills: [],
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
              position: data.position || '',
              phone: data.phone || '',
              skills: data.skills || null,
            });
          } else {
            await setDoc(userDocRef, { email: currentUser.email });
            setProfileData({
              name: '',
              surname: '',
              email: currentUser.email,
              nick: '',
              profilePicture: null,
              position: '',
              phone: '',
              skills: [],
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

  return { user, profileData, hasLoaded };
}
