'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../../libs/firebase'; // Importa la autenticación configurada
import { useRouter } from 'next/navigation';

const LoginController = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const onSubmit = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log('Usuario autenticado:', userCredential.user.email);
      toast.success("Welcome!, "+userCredential.user.email);
      router.push('/dashboard');
    } catch (error) {
      console.log('Error:', error);
      toast.error("Credenciales erróneas");
    }
  };

  const onRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log('Usuario registrado:', userCredential.user.email);
      toast.success("Welcome!, "+userCredential.user.email);
      router.push('/dashboard');
    } catch (error) {
      console.log('Error:', error);
      toast.error("Credenciales erróneas");
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    onSubmit,
    onRegister,
  } as const;
};

export default LoginController;
