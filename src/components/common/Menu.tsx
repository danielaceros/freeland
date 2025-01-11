/* eslint-disable jsx-a11y/control-has-associated-label */
import { usePathname, useRouter } from 'next/navigation';
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
  const pathname = usePathname();
  const t = useTranslations();
  const [showMenu, setShowMenu] = useState(false);

  const isActive = (path: string) => pathname === path;

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
        } sm: z-50 hidden flex-col bg-zinc-800 p-4 text-white transition-all duration-100 md:flex`}
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
              className={`cursor-pointer py-2 hover:text-freeland ${isActive('/dashboard/hire') ? 'text-freeland' : ''}`}
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
              className={`cursor-pointer py-2 hover:text-freeland ${isActive('/dashboard/work') ? 'text-freeland' : ''}`}
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
            <button
              type="button"
              className={`cursor-pointer py-2 hover:text-freeland ${isActive('/dashboard/inbox') ? 'text-freeland' : ''}`}
              onClick={() => router.push('/dashboard/inbox')}
            >
              {isMenuMinimize ? (
                t('menu.chat')
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
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
              )}
            </button>
          </nav>
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
              className={`cursor-pointer py-2 hover:text-freeland ${isActive('/dashboard/hire') ? 'text-freeland' : ''}`}
              onClick={() => router.push('/dashboard/hire')}
            >
              {t('menu.hire')}
            </button>
            <button
              type="button"
              className={`cursor-pointer py-2 hover:text-freeland ${isActive('/dashboard/work') ? 'text-freeland' : ''}`}
              onClick={() => router.push('/dashboard/work')}
            >
              {t('menu.work')}
            </button>
            <button
              type="button"
              className={`cursor-pointer py-2 hover:text-freeland ${isActive('/dashboard/inbox') ? 'text-freeland' : ''}`}
              onClick={() => router.push('/dashboard/inbox')}
            >
              {t('menu.chat')}
            </button>
          </nav>
          {isMenuMinimize && <ViewUsersChat />}
        </div>
      </aside>
    </>
  );
};

export default Menu;
