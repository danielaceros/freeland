"use client";
import { useState, useEffect, type SetStateAction } from "react";
import { auth } from "@/libs/firebase"; // Asegúrate de tener configurado el auth de Firebase
import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore"; // Firebase Firestore
import axios from "axios"; // Para la comunicación con la API

const db = getFirestore(); // Inicializa Firestore

const BotChat = () => {
  const [isOpen, setIsOpen] = useState(false); // Toggle chat visibility
  const [messages, setMessages] = useState([{ sender: "bot", text: "¡Hola! Soy 🤖 Freeland AI®. ¿En qué puedo ayudarte hoy?" }]);
  const [input, setInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar si el usuario está autenticado
  const [userTokens, setUserTokens] = useState(0); // Tokens del usuario
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tokensToBuy, setTokensToBuy] = useState(10); // Tokens que el usuario quiere comprar (valor mínimo de 10)

  // Check user authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchUserTokens(user.uid); // Fetch user tokens on login
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Consulta de los tokens del usuario desde Firestore
  const fetchUserTokens = async (uid: string) => {
    const userDoc = doc(db, "users", uid);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      setUserTokens(userSnap.data().tokens || 0); // Si existen, actualizamos los tokens
    } else {
      console.log("Usuario no encontrado");
      setUserTokens(0); // Si el usuario no existe, establecemos 0 tokens
    }

    // Real-time listener for token updates
    onSnapshot(userDoc, (docSnap) => {
      if (docSnap.exists()) {
        setUserTokens(docSnap.data().tokens || 0);
      }
    });
  };

  // Actualiza los tokens del usuario en Firestore
  const updateUserTokens = async (uid: string, newTokenCount: SetStateAction<number>) => {
    const userDoc = doc(db, "users", uid);
    await updateDoc(userDoc, { tokens: newTokenCount });
    setUserTokens(newTokenCount); // Actualiza el estado local también
  };

  // Manejo del envío de mensajes
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (!isAuthenticated) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Debes iniciar sesión para conectarte a 🤖 Freeland AI®" }]);
      return;
    }

    if (userTokens <= 0) {
      setMessages((prev) => [...prev, { sender: "bot", text: "No tienes suficientes tokens. Por favor recarga tus tokens para continuar." }]);
      return;
    }

    // Deduce 1 token por mensaje
    const updatedTokenCount = userTokens - 1;

    setUserTokens(updatedTokenCount); // Actualiza los tokens en el estado local
    // Actualiza los tokens en Firestore
    const user = auth.currentUser;
    if (user) {
      await updateUserTokens(user.uid, updatedTokenCount);
    }

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput(""); // Clear input field

    try {
      const response = await axios.post("/api/chatbot", { prompt: input }); // Enviar mensaje al servidor
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error comunicándose con el bot:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Hubo un error. Por favor, intenta de nuevo." }]);
    }
  };

  // Abre el modal para comprar tokens
  const handleOpenModal = () => setShowPaymentModal(true);

  // Cierra el modal de pago
  const handleCloseModal = () => setShowPaymentModal(false);

  // Maneja el cambio de cantidad de tokens que el usuario quiere comprar
  const handleTokenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(10, Number(e.target.value)); // Aseguramos que no se ingresen menos de 10 tokens
    setTokensToBuy(value);
  };
  
  // Realiza el pago de tokens y redirige al usuario a Stripe
  const handlePayment = async () => {
    try {
      const response = await axios.post("/api/tokens", { amount: tokensToBuy / 10, productName: `Compra de ${tokensToBuy} tokens` });
      if (response.data.url) {
        // Redirige a la plataforma de pago (como Stripe)
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error al iniciar el pago:", error);
    }
  };

  return (
    <div>
      <button
        className="fixed bottom-6 right-6 bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-500"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        🤖 Freeland AI®
      </button>
      

      {isOpen && (
        <div className="fixed bottom-16 right-6 w-80 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
          <div className="bg-green-600 text-white p-4 text-lg font-semibold flex justify-between items-center">
            <span>🤖 Freeland AI®</span>
            <span className="cursor-pointer" onClick={handleOpenModal}>{userTokens} Tokens</span>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96"> {/* Make chat container scrollable */}
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}>
                <div className={`p-3 rounded-lg ${msg.sender === "bot" ? "bg-gray-200 text-gray-800" : "bg-blue-600 text-white"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-200 flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-lg"
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
              onClick={handleSendMessage}
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      {/* Modal para comprar tokens */}
      {showPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-lg font-semibold text-center mb-4">Compra Tokens</h3>
            <input
              type="number"
              min="10" // Aseguramos que el mínimo de tokens sea 10
              className="w-full rounded-md border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
              value={tokensToBuy}
              onChange={handleTokenInputChange}
              placeholder="¿Cuántos tokens deseas comprar?"
            />
            {/* Muestra en tiempo real la cantidad de tokens que se van a comprar */}
            {tokensToBuy >= 10 && (
              <p className="text-center text-gray-600 mt-1 mb-4">
                Pagarás <strong>{tokensToBuy / 10}</strong>€
              </p>
            )}
            <div className="flex justify-between">
              <button
                onClick={handleCloseModal}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-400"
              >
                Cancelar
              </button>
              <button
                onClick={handlePayment}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none"
              >
                Comprar Tokens
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotChat;
