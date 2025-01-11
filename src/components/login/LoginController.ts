'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { auth, googleProvider } from '../../libs/firebase';

const LoginController = () => {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const onSubmit = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success(t('loginPage.ok'));
      router.push('/dashboard/profile');
      // Handle successful login (e.g., navigate to dashboard)
    } catch (error) {
      console.error(error);
      toast.error(t('loginPage.ko'));
    }
  };

  const onRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success(t('loginPage.accountOK'));
      router.push('/dashboard/profile');
      // Handle successful registration (e.g., navigate to dashboard)
    } catch (error) {
      console.error(error);
      toast.error(t('loginPage.accountKO'));
    }
  };

  const onGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success(`${t('welcome')}, ${result.user.displayName}!`);
      router.push('/dashboard/profile');
      // Handle successful Google sign-in (e.g., navigate to dashboard)
    } catch (error) {
      console.error(error);
      toast.error('Google Sign-In failed. Try again!');
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    onSubmit,
    onRegister,
    onGoogleSignIn,
  };
};

export default LoginController;
