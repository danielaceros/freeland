'use client';

import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'; // Import Firebase Storage functions
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Import toast for notifications

import Menu from '@/components/common/Menu';

import { auth, db, storage } from '../../../../libs/firebase'; // Ensure the import path is correct

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<{
    name: string;
    surname: string | null;
    email: string | null;
    nick: string | null;
    profilePicture: string | null;
    position: string;
    phone: string;
    skills: string[];
  }>({
    name: '',
    surname: '',
    email: '',
    nick: '',
    profilePicture: null,
    position: '',
    phone: '',
    skills: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const [skills, setSkills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

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
              position: data.position || '',
              phone: data.phone || '',
              skills: data.skills || null,
            });
          } else {
            await setDoc(userDocRef, { email: currentUser.email });
            setProfileData({
              name: '',
              surname: '',
              email: currentUser.email,
              nick: '',
              profilePicture: null,
              position: '',
              phone: '',
              skills: [],
            });
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
          toast.error('Failed to load profile data.'); // Notify on error
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
    setProfileData({ ...profileData, skills });
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        if (profilePicture) {
          const storageRef = ref(
            storage,
            `profilePictures/${user.uid}/${profilePicture.name}`,
          );
          await uploadBytes(storageRef, profilePicture);
          const downloadURL = await getDownloadURL(storageRef);
          await setDoc(
            userDocRef,
            {
              ...profileData,
              profilePicture: downloadURL,
            },
            { merge: true },
          );
        } else {
          await setDoc(userDocRef, profileData, { merge: true });
        }

        toast.success('Profile updated successfully!'); // Notify on successful profile update
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating profile data:', error);
        toast.error('Failed to update profile.'); // Notify on error
      }
    }
  };

  if (!user || !hasLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="loader" /> {/* Add your loader here */}
      </div>
    );
  }

  const handleKeyDown = (event: any) => {
    // Detecta la tecla Enter y añade la habilidad si no está vacía y no existe en el array
    if (inputValue !== '' && event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      if (inputValue !== '' && !skills.includes(inputValue.trim())) {
        setSkills([...skills, inputValue.trim()]);
        setInputValue(''); // Limpia el campo de entrada
      }
    }
  };

  const removeSkill = (skillToRemove: any) => {
    // Elimina la habilidad seleccionada del array
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Menu />

      <div className="flex-1">
        <div className="flex w-full justify-end bg-white p-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="rounded bg-freeland px-4 py-2 font-bold text-white hover:bg-green-500"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <main className="px-16 py-6">
          <div className="w-full rounded-lg bg-white p-6 shadow-md">
            {/* Display Profile Picture */}
            <div className="mb-4 flex w-full">
              <div className="flex w-2/12 items-center">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    className="h-4/6 w-full rounded-full border-2 border-green-600"
                  />
                ) : (
                  <p className="text-gray-900">No profile picture set</p>
                )}
              </div>
              <div
                className={`ml-4 w-10/12 ${isEditing ? 'flex' : 'flex'} items-center`}
              >
                {isEditing ? (
                  <div className="w-full">
                    <input
                      type="text"
                      value={profileData.name || ''}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      className="w-96 rounded border border-gray-300 p-2"
                      placeholder={`Enter ${'name'}`}
                    />
                    <input
                      type="text"
                      value={profileData.surname || ''}
                      onChange={(e) =>
                        handleInputChange('surname', e.target.value)
                      }
                      className="ml-1 w-96 rounded border border-gray-300 p-2"
                      placeholder={`Enter ${'surname'}`}
                    />
                    <div className="mt-5 w-full">
                      <p className="block text-gray-700">
                        Editar imagen de usuario
                      </p>
                      <input
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setProfilePicture(file);
                          }
                        }}
                        className="w-full rounded border border-gray-300 p-2"
                      />
                    </div>
                  </div>
                ) : (
                  <h2 className="mb-4 text-xl font-semibold">
                    {profileData.name || `No ${'name'} set`}{' '}
                    {profileData.surname || `No ${'surname'} set`}
                  </h2>
                )}
              </div>
            </div>

            <div className="flex w-full">
              <div className="mb-4 w-4/12">
                <p>Email: </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.email || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full rounded border border-gray-300 p-2"
                    placeholder={`Enter ${'name'}`}
                  />
                ) : (
                  <h2 className="mb-4 text-xl font-semibold">
                    {profileData.email}
                  </h2>
                )}
              </div>
              <div className="mb-4 ml-5  w-4/12">
                <p>Puesto: </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.position || ''}
                    onChange={(e) =>
                      handleInputChange('position', e.target.value)
                    }
                    className="w-full rounded border border-gray-300 p-2"
                    placeholder={`Enter ${'position'}`}
                  />
                ) : (
                  <h2 className="mb-4 text-xl font-semibold">
                    {profileData.position}
                  </h2>
                )}
              </div>
              <div className="mb-4 ml-5  w-4/12">
                <p>Teléfono: </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full rounded border border-gray-300 p-2"
                    placeholder={`Enter ${'phone'}`}
                  />
                ) : (
                  <h2 className="mb-4 text-xl font-semibold">
                    {profileData.phone}
                  </h2>
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="mb-4">
                <p>Habilidades: </p>
                {isEditing ? (
                  <>
                    <div className="w-full">
                      <input
                        type="text"
                        id="skills"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Escribe una habilidad y presiona Enter"
                        className="w-full rounded border border-gray-300 p-2"
                      />
                    </div>
                    <div className="flex pt-3">
                      {skills.map((skill) => (
                        <div
                          key={skill}
                          className="mb-2 mr-2 flex items-center rounded-full bg-freeland px-2 py-1 text-sm font-medium text-white"
                        >
                          {skill.toUpperCase()}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 text-white hover:text-zinc-600 focus:outline-none"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex pt-3">
                    {profileData.skills &&
                      profileData.skills.map((skill: string) => (
                        <div
                          key={skill}
                          className="mb-2 mr-2 rounded-full bg-freeland px-2 py-1 text-sm font-medium text-white"
                        >
                          {skill.toUpperCase()}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={handleSave}
              className="mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500"
            >
              Save
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
