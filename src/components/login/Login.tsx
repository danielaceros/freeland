'use client';

import { ChangeEvent } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Logo } from '../common/Logo'; // Replace with your logo component
import { Button } from '../ui/button'; // Replace with your button component
import { Input } from '../ui/input'; // Replace with your input component
import LoginController from './LoginController';
import { auth } from '../../libs/firebase'; // Ensure correct import for your Firebase config
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify'; // To show notifications

const Login = () => {
  const { email, password, setEmail, setPassword, onSubmit, onRegister, onGoogleSignIn } =
    LoginController();

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address to reset your password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      toast.error('Failed to send password reset email.');
    }
  };

  return (
    <div className="height100 flex min-h-full flex-1 flex-col justify-center bg-slate-950 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          action="#"
          method="POST"
          className="space-y-6 rounded-md bg-white bg-opacity-10 p-10"
        >
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          {/* Email Input */}
          <div>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="bg-white"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="bg-white"
              required
            />
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-start">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-gray-400 underline hover:text-white"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login and Register Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={onSubmit}
              type="button"
              className="flex w-full justify-center rounded-md bg-freeland px-3 py-1.5 text-lg font-semibold text-white hover:bg-freeland-dark"
            >
              Login
            </Button>
            <Button
              onClick={onRegister}
              type="button"
              className="flex w-full justify-center rounded-md bg-freeland px-3 py-1.5 text-lg font-semibold text-white hover:bg-freeland-dark"
            >
              Register
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center mt-6">
            <span className="text-sm text-gray-300">or</span>
          </div>

          {/* Google Sign-In Button */}
          <Button
            onClick={onGoogleSignIn}
            type="button"
            className="flex w-full items-center justify-center space-x-2 rounded-md border-2 border-white px-3 py-2 text-lg font-semibold text-white bg-black hover:text-black hover:bg-white transition-colors duration-200"
          >
            <FcGoogle size={24} />
            <span>Sign in with Google</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export { Login };
