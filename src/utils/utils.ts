'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { auth, db } from '@/libs/firebase';
import { changeLoaded, changeUser, changeUserData } from '@/store/userStore';

export const loadUser = (disp: any) => {
  const dispatch = disp;

  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      dispatch(changeUser(currentUser));
      const userDocRef = doc(db, 'users', currentUser.uid);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          dispatch(
            changeUserData({
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
              lang: data.lang || null,
            }),
          );
        } else {
          await setDoc(userDocRef, { email: currentUser.email });
          dispatch(
            changeUserData({
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
              lang: [],
            }),
          );
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data.'); // Notify on error
      }
      dispatch(changeLoaded(true));
    } else {
      dispatch(changeUser(null));
    }
  });

  return () => unsubscribe();
};
