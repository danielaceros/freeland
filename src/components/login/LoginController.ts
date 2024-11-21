'use client';

import { useState } from 'react';
import { auth, googleProvider } from '../../libs/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const LoginController = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const onSubmit = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully logged in!');
      router.push('/dashboard');
      // Handle successful login (e.g., navigate to dashboard)
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const onRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!');
      router.push('/dashboard');
      // Handle successful registration (e.g., navigate to dashboard)
    } catch (error) {
      console.error(error);
      toast.error('Registration failed. Try again!');
    }
  };

  const onGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success(`Welcome, ${result.user.displayName}!`);
      router.push('/dashboard');
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
