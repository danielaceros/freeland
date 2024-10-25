"use client";
import { useEffect, useState } from 'react';
import { auth, db, storage } from '../../../../libs/firebase'; // Ensure the import path is correct
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import { signOut } from 'firebase/auth'; // Import signOut method
import { toast } from 'react-toastify'; // Import toast for notifications

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<{
    name: string | null;
    surname: string | null;
    email: string | null;
    nick: string | null;
    profilePicture: string | null;
  }>({
    name: '',
    surname: '',
    email: '',
    nick: '',
    profilePicture: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  
  const router = useRouter(); // Get router instance

  // Fetch profile data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfileData({
              name: data.name || '',
              surname: data.surname || '',
              email: data.email || currentUser.email,
              nick: data.nick || '',
              profilePicture: data.profilePicture || null,
            });
          } else {
            await setDoc(userDocRef, { email: currentUser.email });
            setProfileData({
              name: '',
              surname: '',
              email: currentUser.email,
              nick: '',
              profilePicture: null,
            });
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
          toast.error("Failed to load profile data."); // Notify on error
        }
        setHasLoaded(true);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSave = async () => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        if (profilePicture) {
          const storageRef = ref(storage, `profilePictures/${user.uid}/${profilePicture.name}`);
          await uploadBytes(storageRef, profilePicture);
          const downloadURL = await getDownloadURL(storageRef);
          await setDoc(userDocRef, {
            ...profileData,
            profilePicture: downloadURL
          }, { merge: true });
        } else {
          await setDoc(userDocRef, profileData, { merge: true });
        }

        toast.success("Profile updated successfully!"); // Notify on successful profile update
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating profile data:", error);
        toast.error("Failed to update profile."); // Notify on error
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!"); // Notify on successful logout
      router.push('/'); // Redirect to home page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user || !hasLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div> {/* Add your loader here */}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-green-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">¡Welcome, {user.email?.split("@")[0]}!</h1> {/* Display user's email here */}
        <nav>
        <ul>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer" onClick={() => router.push('/en/dashboard')}>
              Dashboard
            </li>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer" onClick={() => router.push('/en/dashboard/hire')}>
              Hire
            </li>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer" onClick={() => router.push('/en/dashboard/work')}>
              Work
            </li>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer bg-green-600" onClick={() => router.push('/en/dashboard/profile')}>
              Profile
            </li>
            <li className="px-4 py-2 hover:bg-green-700 cursor-pointer" onClick={handleLogout}>
              Logout
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 p-6">
        <header className="flex justify-between items-center bg-white p-4 shadow">
          <h2 className="text-3xl font-semibold">Profile</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </header>

        <main className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">User Profile</h3>

            {/* Display Profile Picture */}
            <div className="mb-4 flex justify-center">
              {profileData.profilePicture ? (
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-2 border-green-600"
                />
              ) : (
                <p className="text-gray-900">No profile picture set</p>
              )}
            </div>

            {/* Editable Fields */}
            {(['name', 'surname', 'email', 'nick'] as Array<keyof typeof profileData>).map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-gray-700 capitalize">{field}</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder={`Enter ${field}`}
                  />
                ) : (
                  <p className="text-gray-900">{profileData[field] || `No ${field} set`}</p>
                )}
              </div>
            ))}

            {/* File Input for Profile Picture */}
            {isEditing && (
              <div className="mb-4">
                <label className="block text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfilePicture(file);
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            )}

            {/* Save Button */}
            {isEditing && (
              <button
                onClick={handleSave}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
              >
                Save
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
