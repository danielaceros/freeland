"use client";

import { useEffect, useState } from "react";
import { auth } from "@/libs/firebase"; // Your Firebase auth setup
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const db = getFirestore(); // Initialize Firestore

const SuccessPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null); // Store the user object
  const [tokensAdded, setTokensAdded] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user when authenticated
      }
    });

    return () => unsubscribe(); // Clean up the listener when the component is unmounted
  }, [router]);

  useEffect(() => {
    const tokens = new URLSearchParams(window.location.search).get("tokens");

    if (tokens && user) {
      handleSuccess(parseInt(tokens));
    } else {
      // Redirect to home if parameters or user are missing
    }
  }, [user, router]);

  const handleSuccess = async (tokens: number) => {
    if (user) {
      try {
        // Get the user document in Firestore
        const userDoc = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          // If user exists, update their token count
          const newTokenCount = (userSnap.data().tokens || 0) + tokens;
          await updateDoc(userDoc, { tokens: newTokenCount });

          setTokensAdded(tokens); // Set the tokens added to state
        } else {
          console.error("User not found in Firestore");
        }
      } catch (error) {
        console.error("Error updating tokens:", error);
      }
    }

    // After processing, stop loading and redirect
    setLoading(false);
    setTimeout(() => {
      router.push("/"); // Redirect to home page after 2 seconds
    }, 300);
  };

  return (
    <div>
      {loading ? (
        <div>Processing your payment...</div>
      ) : (
        <div>
          <p>Payment successful!</p>
          <p>{tokensAdded} tokens have been added to your account.</p>
          <p>Redirecting to home...</p>
        </div>
      )}
    </div>
  );
};

export default SuccessPage;
