'use client';

import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslations } from 'next-intl'; // Import useTranslations for translations
import { useEffect, useState } from 'react';

import Menu from '@/components/common/Menu';

import { auth } from '../../../libs/firebase';

export default function Dashboard() {
  const t = useTranslations(); // Initialize translations
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const LoadingSpinner = () => (
    <div className="flex h-full items-center justify-center">
      <div className="size-16 animate-spin rounded-full border-y-4 border-green-600" />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Menu />

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white p-4 shadow">
          <h2 className="text-3xl font-semibold">{t('dashboard.title')}</h2>
          <div className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500">
            {t('dashboard.addNew')}
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-6">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div>
              {user && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">
                    {t('dashboard.welcome', {
                      user: user.displayName || user.email,
                    })}
                  </h3>
                </div>
              )}

              <div className="mb-6 grid grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
                  <h3 className="text-lg font-semibold">
                    {t('dashboard.cards.totalSales.title')}
                  </h3>
                  <p className="text-3xl text-green-600">$10,000</p>
                  <p className="text-gray-600">
                    {t('dashboard.cards.totalSales.change')}
                  </p>
                </div>

                {/* Card 2 */}
                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
                  <h3 className="text-lg font-semibold">
                    {t('dashboard.cards.activeUsers.title')}
                  </h3>
                  <p className="text-3xl text-green-600">1,250</p>
                  <p className="text-gray-600">
                    {t('dashboard.cards.activeUsers.change')}
                  </p>
                </div>

                {/* Card 3 */}
                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
                  <h3 className="text-lg font-semibold">
                    {t('dashboard.cards.newSignups.title')}
                  </h3>
                  <p className="text-3xl text-green-600">300</p>
                  <p className="text-gray-600">
                    {t('dashboard.cards.newSignups.change')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Card 4 */}
                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
                  <h3 className="text-lg font-semibold">
                    {t('dashboard.cards.latestActivity.title')}
                  </h3>
                  <ul className="mt-2">
                    <li className="text-gray-700">
                      {t('dashboard.cards.latestActivity.items.0')}
                    </li>
                    <li className="text-gray-700">
                      {t('dashboard.cards.latestActivity.items.1')}
                    </li>
                    <li className="text-gray-700">
                      {t('dashboard.cards.latestActivity.items.2')}
                    </li>
                    <li className="text-gray-700">
                      {t('dashboard.cards.latestActivity.items.3')}
                    </li>
                  </ul>
                </div>

                {/* Card 5 */}
                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-xl">
                  <h3 className="text-lg font-semibold">
                    {t('dashboard.cards.revenueOverview.title')}
                  </h3>
                  <p className="text-3xl text-green-600">$2,500</p>
                  <p className="text-gray-600">
                    {t('dashboard.cards.revenueOverview.subtitle')}
                  </p>
                  <div className="mt-4">
                    <div
                      className="h-4 rounded bg-green-200"
                      style={{ width: '75%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
