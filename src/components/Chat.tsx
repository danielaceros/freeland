import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/libs/firebase"; // Assuming your Firebase setup is here

interface Message {
  id: string;
  senderId: string;
  message: string;
  timestamp: number;
}

const Chat = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Function to fetch the messages for the chat in real-time
  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      setMessages(messagesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Function to handle the form submission to send a message
  const handleSendMessage = async (event: FormEvent) => {
    event.preventDefault();

    if (!newMessage.trim()) return;

    try {
      const messagesRef = collection(db, "chats", chatId!, "messages");
      await addDoc(messagesRef, {
        senderId: "recruiterId", // Replace with the actual recruiterId
        message: newMessage,
        timestamp: new Date(),
      });

      setNewMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with Freelancer</h2>
        <button onClick={() => navigate("/dashboard")} className="back-button">
          Back to Dashboard
        </button>
      </div>

      <div className="chat-box">
        {loading ? (
          <p>Loading chat...</p>
        ) : (
          <ul>
            {messages.map((msg) => (
              <li key={msg.id} className={msg.senderId === "recruiterId" ? "recruiter-msg" : "freelancer-msg"}>
                <p>{msg.message}</p>
                <span>{new Date(msg.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default Chat;
