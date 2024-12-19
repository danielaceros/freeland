/* eslint-disable jsx-a11y/control-has-associated-label */
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import ViewUsersChat from './chat/ViewUsersChat';
import { Logo } from './Logo';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const t = useTranslations();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside
      className={`${
        isOpen ? 'w-56' : 'w-20'
      } z-50 flex flex-col bg-zinc-800 p-4 text-white transition-all duration-100`}
    >
      <button
        type="button"
        className="flex justify-end p-4 focus:outline-none"
        onClick={toggleSidebar}
      >
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
      <nav className="flex flex-col items-start pl-3">
        <button
          type="button"
          className="cursor-pointer py-2 hover:text-freeland"
          onClick={() => router.push('/dashboard/')}
        >
          {isOpen ? (
            t('menu.dashboard')
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
            t('menu.hire')
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
            t('menu.work')
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          )}
        </button>
      </nav>
      {isOpen && <ViewUsersChat />}
    </aside>
  );
};

export default Menu;
