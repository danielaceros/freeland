'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useState } from 'react';

import { auth } from '../../libs/firebase'; // Importa la autenticación configurada

const LoginController = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log('Usuario autenticado:', userCredential.user);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log('Usuario registrado:', userCredential.user);
    } catch (error) {
      console.log('Error:', error);
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
