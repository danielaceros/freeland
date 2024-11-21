/* eslint-disable jsx-a11y/control-has-associated-label */
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl'; // Import useTranslations hook
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { useUser } from '@/hooks/useUser';
import { auth } from '@/libs/firebase';

import { Logo } from './Logo';

const Menu = () => {
  const { profileData } = useUser();
  const userName = profileData.name;
  const lastName = profileData.surname;
  const img = profileData.profilePicture;
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter(); // Get router instance
  const t = useTranslations(); // Initialize useTranslations

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success(t('menu.loggedOut')); // Use translation key for logout success message
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } flex flex-col bg-zinc-800 p-4 text-white transition-all duration-100`}
    >
      <button
        type="button"
        className="flex justify-end p-4 focus:outline-none"
        onClick={toggleSidebar}
      >
        {/* Icono del menú */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      <button
        type="button"
        className="flex cursor-pointer justify-center"
        onClick={() => router.push('/dashboard')}
      >
        <Logo />
      </button>
      <hr className="my-7 border-zinc-700" />
      <button
        type="button"
        className="mb-5 flex cursor-pointer"
        onClick={() => router.push('/dashboard/profile')}
      >
        {img && (
          <img
            src={img}
            alt={t('menu.viewProfile')} // Use translation key for "View Profile"
            className={`${isOpen ? 'size-16' : 'size-12'} rounded-full border-2 border-green-600`}
          />
        )}
        {isOpen && (
          <div className="ml-3 text-left text-freeland">
            <p className="text-xl font-bold">{userName || profileData.email}</p>
            <p className="text-md font-bold">{lastName}</p>
          </div>
        )}
      </button>
      <nav className="flex flex-col items-start pl-3">
        <button
          type="button"
          className="cursor-pointer py-2 hover:text-freeland"
          onClick={() => router.push('/dashboard/')}
        >
          {isOpen ? (
            t('menu.dashboard') // Use translation key for "Dashboard"
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="cursor-pointer py-2 hover:text-freeland"
          onClick={() => router.push('/dashboard/hire')}
        >
          {isOpen ? (
            t('menu.hire') // Use translation key for "Hire"
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="cursor-pointer py-2 hover:text-freeland"
          onClick={() => router.push('/dashboard/work')}
        >
          {isOpen ? (
            t('menu.work') // Use translation key for "Work"
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="cursor-pointer py-2 hover:text-freeland"
          onClick={handleLogout}
        >
          {isOpen ? (
            t('menu.logout') // Use translation key for "Logout"
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
          )}
        </button>
      </nav>
    </aside>
  );
};

export default Menu;
