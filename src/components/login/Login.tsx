'use client';

import { ChangeEvent, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Logo } from '../common/Logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import LoginController from './LoginController';
import { auth } from '../../libs/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';  // Import useRouter from 'next/navigation'

const Login = () => {
  const t = useTranslations();
  const { email, password, setEmail, setPassword, onSubmit, onRegister, onGoogleSignIn } =
    LoginController();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error(t('resetPasswordPrompt'));
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(t('resetPasswordSuccess'));
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      toast.error(t('resetPasswordError'));
    }
  };

  const handleLocaleChange = (locale: string) => {
    // Get the current path without the locale
    const currentPath = window.location.pathname.replace(/^\/[a-z]{2}/, ''); // Remove the existing locale from path
    
    // Update the URL with the new locale
    const newPath = `/${locale}${currentPath}`;
    
    // Use router.push to navigate to the new URL
    router.push(newPath);
  };

  return (
    <div className="height100 flex min-h-full flex-1 flex-col justify-center bg-slate-950 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          action="#"
          method="POST"
          className="space-y-6 rounded-md bg-white bg-opacity-10 p-10"
        >
          <div className="flex justify-between mb-6">
            <Logo />
            <div>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-white"
              >
                🌐
              </button>
              {isDropdownOpen && (
                <div className="absolute bg-gray-700 text-white rounded-md p-2 mt-2">
                  <button
                    onClick={() => handleLocaleChange('en')}
                    className="block px-4 py-2 hover:bg-green-600"
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLocaleChange('es')}
                    className="block px-4 py-2 hover:bg-green-600"
                  >
                    Español
                  </button>
                  <button
                    onClick={() => handleLocaleChange('fr')}
                    className="block px-4 py-2 hover:bg-green-600"
                  >
                    Français
                  </button>
                  <button
                    onClick={() => handleLocaleChange('it')}
                    className="block px-4 py-2 hover:bg-green-600"
                  >
                    Italiano
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <Input
              id="email"
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="bg-white"
              required
            />
          </div>

          <div>
            <Input
              id="password"
              type="password"
              placeholder={t('password')}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="bg-white"
              required
            />
          </div>

          <div className="flex justify-start">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-gray-400 underline hover:text-white"
            >
              {t('forgotPassword')}
            </button>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={onSubmit}
              type="button"
              className="flex w-full justify-center rounded-md bg-freeland px-3 py-1.5 text-lg font-semibold text-white hover:bg-freeland-dark"
            >
              {t('login')}
            </Button>
            <Button
              onClick={onRegister}
              type="button"
              className="flex w-full justify-center rounded-md bg-freeland px-3 py-1.5 text-lg font-semibold text-white hover:bg-freeland-dark"
            >
              {t('register')}
            </Button>
          </div>

          <div className="flex items-center justify-center mt-6">
            <span className="text-sm text-gray-300">{t('or')}</span>
          </div>

          <Button
            onClick={onGoogleSignIn}
            type="button"
            className="flex w-full items-center justify-center space-x-2 rounded-md border-2 border-white px-3 py-2 text-lg font-semibold text-white bg-black hover:text-black hover:bg-white transition-colors duration-200"
          >
            <FcGoogle size={24} />
            <span>{t('googleSignIn')}</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export { Login };
