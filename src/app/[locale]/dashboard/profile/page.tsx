'use client';

import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'; // Import Firebase Storage functions
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Import toast for notifications

import Menu from '@/components/common/Menu';

import { auth, db, storage } from '../../../../libs/firebase'; // Ensure the import path is correct
import HeaderProfile from './headerProfile/HeaderProfile';
import FormEditHistory from './historyProfile/formEditHistory/FormEditHistory';
import HistoryProfile, {
  type HistoryUserProps,
} from './historyProfile/HistoryProfile';
import SkillsProfile from './skillsProfile/SkillsProfile';

interface HistoyProfile {
  id: number;
  rol: string;
  company: string;
  fromDate: Date;
  toDate: Date;
  description: string;
}

export interface ProfileDataInterface {
  name: string;
  surname: string | null;
  email: string | null;
  nick: string | null;
  profilePicture: string | null;
  profilePictureBackground: string | null;
  position: string;
  phone: string;
  skills: string[];
  history: HistoyProfile[];
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<ProfileDataInterface>({
    name: '',
    surname: '',
    email: '',
    nick: '',
    profilePicture: null,
    profilePictureBackground: null,
    position: '',
    phone: '',
    skills: [],
    history: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureBackground, setProfilePictureBackground] =
    useState<File | null>(null);
  const [newHistory, setNewHistory] = useState<boolean>(false);
  const [newHistoryUser, setNewHistoryUser] = useState<HistoryUserProps>({
    rol: '',
    company: '',
    fromDate: new Date(),
    toDate: new Date(),
    description: '',
  } as HistoryUserProps);

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
              profilePictureBackground: data.profilePictureBackground || null,
              position: data.position || '',
              phone: data.phone || '',
              skills: data.skills || null,
              history: data.history || null,
            });
          } else {
            await setDoc(userDocRef, { email: currentUser.email });
            setProfileData({
              name: '',
              surname: '',
              email: currentUser.email,
              nick: '',
              profilePicture: null,
              profilePictureBackground: null,
              position: '',
              phone: '',
              skills: [],
              history: [],
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

  useEffect(() => {
    if (profileData.history && profileData.history.length > 0) {
      profileData.history.push(newHistoryUser);
    } else {
      profileData.history = [newHistoryUser];
    }
  }, [newHistoryUser]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSave = async () => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        if (profilePicture || profilePictureBackground) {
          let downloadURL = null;
          let downloadURLB = null;
          if (profilePicture) {
            const storageRef = ref(
              storage,
              `profilePictures/${user.uid}/${profilePicture.name}`,
            );
            await uploadBytes(storageRef, profilePicture);
            downloadURL = await getDownloadURL(storageRef);
          }
          if (profilePictureBackground) {
            const storageRef = ref(
              storage,
              `profilePictures/${user.uid}/${profilePictureBackground.name}`,
            );
            await uploadBytes(storageRef, profilePictureBackground);
            downloadURLB = await getDownloadURL(storageRef);
          }
          await setDoc(
            userDocRef,
            {
              ...profileData,
              profilePicture: downloadURL || profileData.profilePicture,
              profilePictureBackground:
                downloadURLB || profileData.profilePictureBackground,
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

  const changeHistoryUser = (historyData: HistoryUserProps) => {
    const updateHistory = profileData.history.map((his) => {
      if (his.id === historyData.id) {
        return historyData;
      }
      return his;
    });
    setProfileData({ ...profileData, history: updateHistory });
  };

  const deteleHistory = (historyUser: HistoryUserProps) => {
    const updateHistory = profileData.history.filter(
      (his) => historyUser.id !== his.id,
    );
    setProfileData({ ...profileData, history: updateHistory });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Menu />
      <div className="max-h-screen flex-1 overflow-y-auto ">
        <div className="fixed bottom-0 right-0 z-50 flex rounded-md bg-white px-4 py-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`${isEditing ? 'bg-red-600 hover:bg-red-800' : 'bg-freeland hover:bg-green-500'} rounded  px-4 py-2 font-bold text-white `}
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleSave}
              className="ml-3 rounded bg-freeland px-4 py-2 font-bold text-white hover:bg-green-500"
            >
              Guardar
            </button>
          )}
        </div>
        <div className="mb-3 w-full rounded-lg bg-white shadow-md">
          <HeaderProfile
            profileData={profileData}
            bg={profilePictureBackground}
          />
        </div>
        <main className="px-16 py-6">
          {isEditing && (
            <>
              <div className="my-3 w-full rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex w-full">
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
                        Subir imagen de usuario. Tamaño recomendado: (300px X
                        300px)
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
                    <div className="mt-5 w-full">
                      <p className="block text-gray-700">
                        Subir imagen de fondo
                      </p>
                      <input
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setProfilePictureBackground(file);
                          }
                        }}
                        className="w-full rounded border border-gray-300 p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-3 w-full rounded-lg bg-white p-6 shadow-md">
                <div className="flex w-full">
                  <div className="mb-4 w-4/12">
                    <p>Email: </p>
                    <input
                      type="text"
                      value={profileData.email || ''}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      className="w-full rounded border border-gray-300 p-2"
                      placeholder={`Enter ${'name'}`}
                    />
                  </div>
                  <div className="mb-4 ml-5  w-4/12">
                    <p>Puesto: </p>
                    <input
                      type="text"
                      value={profileData.position || ''}
                      onChange={(e) =>
                        handleInputChange('position', e.target.value)
                      }
                      className="w-full rounded border border-gray-300 p-2"
                      placeholder={`Enter ${'position'}`}
                    />
                  </div>
                  <div className="mb-4 ml-5  w-4/12">
                    <p>Teléfono: </p>
                    <input
                      type="text"
                      value={profileData.phone || ''}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      className="w-full rounded border border-gray-300 p-2"
                      placeholder={`Enter ${'phone'}`}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="my-3 w-full rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 w-full">
              <SkillsProfile
                isEditing={isEditing}
                profileData={profileData}
                onChangeSkills={setProfileData}
              />
            </div>
          </div>
          <div className="my-3 w-full rounded-lg bg-white p-6 shadow-md">
            <div className="w-full">
              <div className="flex w-full justify-between">
                <h2 className="mb-5 text-xl font-bold">Experiencia</h2>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setNewHistory(true)}
                    className="mb-8 mt-4 rounded bg-freeland px-4 py-2 text-white hover:bg-green-500"
                  >
                    Añadir Experiencia
                  </button>
                )}
              </div>

              {newHistory && (
                <FormEditHistory
                  open={newHistory}
                  onChangeOpen={setNewHistory}
                  data={newHistoryUser}
                  onChangeHistory={setNewHistoryUser}
                />
              )}

              {profileData.history &&
                profileData.history.map((history) => {
                  return (
                    <HistoryProfile
                      key={history.id}
                      historyUser={history}
                      edit={isEditing}
                      onChangeHistoryUser={changeHistoryUser}
                      deleteHistory={deteleHistory}
                    />
                  );
                })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
