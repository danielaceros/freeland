/* eslint-disable jsx-a11y/control-has-associated-label */
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changeStateMinimize } from '@/store/minimizeMenuStore';

import ViewUsersChat from './chat/ViewUsersChat';
import { Logo } from './Logo';

const Menu = () => {
  const dispatch = useDispatch();
  const isMenuMinimize =
    useSelector((state: any) => state.menuMinimize.isMenuMinimize) || null;
  const router = useRouter();
  const t = useTranslations();
  const [showMenu, setShowMenu] = useState(false);

  const toggleSidebar = () => {
    dispatch(changeStateMinimize(!isMenuMinimize));
  };

  const toggleSidebarMovile = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <aside
        className={`${
          isMenuMinimize ? 'w-56' : 'w-20'
        } z-50 flex flex-col justify-between bg-zinc-800 p-4 text-white transition-all duration-100 sm:hidden md:block`}
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
        <div className="flex flex-col justify-between">
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
              {isMenuMinimize ? (
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
              {isMenuMinimize ? (
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
              {isMenuMinimize ? (
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
          {isMenuMinimize && <ViewUsersChat />}
        </div>
      </aside>

      <aside
        className={`${showMenu ? 'bg-zinc-800' : 'fixed'} z-50 flex flex-col p-4 pt-1 text-white transition-all duration-100 md:hidden`}
      >
        <button
          type="button"
          className="flex justify-end p-4 focus:outline-none"
          onClick={toggleSidebarMovile}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke={`${showMenu ? 'currentColor' : 'black'}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <div className={`${showMenu ? 'block' : 'hidden'} `}>
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
              {t('menu.dashboard')}
            </button>
            <button
              type="button"
              className="cursor-pointer py-2 hover:text-freeland"
              onClick={() => router.push('/dashboard/hire')}
            >
              {t('menu.hire')}
            </button>
            <button
              type="button"
              className="cursor-pointer py-2 hover:text-freeland"
              onClick={() => router.push('/dashboard/work')}
            >
              {t('menu.work')}
            </button>
          </nav>
          {isMenuMinimize && <ViewUsersChat />}
        </div>
      </aside>
    </>
  );
};

export default Menu;
