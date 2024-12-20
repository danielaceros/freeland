"use client";

import { useEffect } from "react";

const FailedPage = () => {
  useEffect(() => {
    // Redirige al usuario a la página de inicio
    window.location.href = process.env.NODE_ENV === "production" 
      ? "https://freeland-phi.vercel.app/"
      : "http://localhost:3000/";
  }, []);

  return (
    <div className="container p-6">
      <p>Tu pago ha fallado. Serás redirigido...</p>
    </div>
  );
};

export default FailedPage;
