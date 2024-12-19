'use client';

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { auth } from '@/libs/firebase';

const BarTop = () => {
  const profileData = useSelector((state: any) => state.user.data);
  const t = useTranslations();
  const router = useRouter();
  const img = profileData.profilePicture;

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success(t('menu.loggedOut'));
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="fixed right-0 top-0 z-40 flex w-full justify-end  bg-white px-4 py-2 shadow-md">
      <button
        type="button"
        className="flex cursor-pointer items-center"
        onClick={toggleDropdown}
      >
        {img ? (
          <img
            src={img}
            alt={t('menu.viewProfile')}
            className="size-12 rounded-full border-2 border-green-600"
          />
        )
        : (
          <div className="size-12 rounded-full border-2 border-green-600 text-center bg-gray-100" style={{paddingLeft:'2px'}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="grey" className="size-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
        )}
      </button>
      {isOpen && (
        <button
          type="button"
          className="absolute right-3 top-16 mt-2 w-auto rounded-lg border border-gray-200 bg-zinc-800 p-5 shadow-lg"
          onClick={() => setIsOpen(false)}
        >
          <div className="border-b-2 pb-2 text-left text-freeland">
            <p className="text-xl font-bold">
              {profileData.name || 'Editar perfil'}{' '}
              {profileData.surname || profileData.email}
            </p>
            <p className="text-md font-bold">{profileData.position}</p>
          </div>
          <div className="flex flex-col items-start">
            <button
              type="button"
              className="w-full cursor-pointer py-2 text-left text-sm text-white hover:text-freeland"
              onClick={() => router.push('/dashboard/profile')}
            >
              Mi Perfil
            </button>
            <button
              type="button"
              className="w-full cursor-pointer py-2 text-left text-sm text-white hover:text-freeland"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        </button>
      )}
    </div>
  );
};

export default BarTop;
