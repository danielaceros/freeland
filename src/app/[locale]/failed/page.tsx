'use client';

import { useEffect, useState } from 'react';

const FailedPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true once the component has mounted
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Redirige al usuario a la página de inicio
      window.location.href =
        process.env.NODE_ENV === 'production'
          ? 'https://freeland-phi.vercel.app/'
          : 'http://localhost:3000/';
    }
  }, [isClient]);

  return (
    <div className="container p-6">
      <p>Tu pago ha fallado. Serás redirigido...</p>
    </div>
  );
};

export default FailedPage;
