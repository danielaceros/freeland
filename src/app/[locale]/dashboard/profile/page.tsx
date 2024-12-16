'use client';

import type { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'; // Import Firebase Storage functions
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'; // Import toast for notifications

import BarTop from '@/components/common/BarTop';
import Menu from '@/components/common/Menu';
import { changeUserData } from '@/store/userStore';
import { loadUser } from '@/utils/utils';

import { db, storage } from '../../../../libs/firebase'; // Ensure the import path is correct
import CertiProfile, { type CertiUserProps } from './certiProfile/CertiProfile';
import FormEditCerti from './certiProfile/formEditCerti/FormEditCerti';
import HeaderProfile from './headerProfile/HeaderProfile';
import FormEditHistory from './historyProfile/formEditHistory/FormEditHistory';
import HistoryProfile, {
  type HistoryUserProps,
} from './historyProfile/HistoryProfile';
import FormEditLang from './langProfile/formEditLang/FormEditLang';
import LangProfile, { type LangUserProps } from './langProfile/LangProfile';
import SkillsProfile from './skillsProfile/SkillsProfile';

export interface HistoyProfile {
  id: string;
  rol: string;
  company: string;
  fromDate: Date;
  toDate: Date;
  description: string;
}

export interface CertiProfileData {
  id: string;
  certiTitle: string;
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
  certi: CertiProfileData[];
  lang: LangUserProps[];
}

export default function Profile() {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user.data);
  const userDataU = useSelector((state: any) => state.user.userData);
  const hasLoaded = useSelector((state: any) => state.user.loaded);
  const [user, setUser] = useState<User | null>(null);

  const [oldProfileData, setOldProfileData] = useState<ProfileDataInterface>({
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
    certi: [],
    lang: [],
  });
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
    certi: [],
    lang: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureBackground, setProfilePictureBackground] =
    useState<File | null>(null);
  const [newHistory, setNewHistory] = useState<boolean>(false);
  const [newCerti, setNewCerti] = useState<boolean>(false);
  const [newLang, setNewLang] = useState<boolean>(false);
  const newHistoryUser = {
    id: '',
    rol: '',
    company: '',
    fromDate: new Date(),
    toDate: new Date(),
    description: '',
  };
  const newCertiUser = {
    id: '',
    certiTitle: '',
    company: '',
    fromDate: new Date(),
    toDate: new Date(),
    description: '',
  };
  const newLangUser = {
    id: '',
    lang: '',
    level: '',
  };

  useEffect(() => {
    loadUser(dispatch);
  }, []);

  useEffect(() => {
    if (userData) {
      setProfileData(userData);
      setOldProfileData(userData);
      setUser(userDataU);
    }
  }, [userData]);

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

        dispatch(changeUserData(profileData));
        setOldProfileData(profileData);
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

  const changeCertiUser = (certiData: CertiUserProps) => {
    const updateCerti = profileData.certi.map((his) => {
      if (his.id === certiData.id) {
        return certiData;
      }
      return his;
    });
    setProfileData({ ...profileData, certi: updateCerti });
  };

  const deteleCerti = (certiUser: CertiUserProps) => {
    const updateCerti = profileData.certi.filter(
      (his) => certiUser.id !== his.id,
    );
    setProfileData({ ...profileData, certi: updateCerti });
  };

  const onCancel = () => {
    setProfileData(oldProfileData);
    setIsEditing(false);
  };

  const updateSkills = (newSkills: string[]) => {
    setProfileData({ ...profileData, skills: newSkills });
  };

  console.log('profileData.lang', profileData.lang);
  return (
    <div className="flex h-screen bg-gray-100">
      <Menu />
      <div className="max-h-screen flex-1 overflow-y-auto pt-16">
        <BarTop />
        <div className="fixed bottom-0 right-0 z-50 flex rounded-md bg-white px-4 py-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                className="ml-3 rounded bg-freeland px-4 py-2 font-bold text-white hover:bg-green-500"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="hover:bg-red-800' rounded bg-red-600  px-4 py-2 font-bold text-white"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`${isEditing ? 'bg-red-600 hover:bg-red-800' : 'bg-freeland hover:bg-green-500'} rounded  px-4 py-2 font-bold text-white `}
            >
              {isEditing ? 'Cancelar' : 'Editar'}
            </button>
          )}
        </div>
        <div className="mb-3 w-full rounded-lg bg-white shadow-md">
          <HeaderProfile
            profileData={profileData}
            bg={profilePictureBackground}
          />
        </div>
        <main className="flex flex-wrap px-16 py-6">
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
                      className="w-96 rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
                      placeholder={`Enter ${'name'}`}
                    />
                    <input
                      type="text"
                      value={profileData.surname || ''}
                      onChange={(e) =>
                        handleInputChange('surname', e.target.value)
                      }
                      className="ml-1 w-96 rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
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
                        className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
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
                        className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
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
                      className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
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
                      className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
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
                      className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
                      placeholder={`Enter ${'phone'}`}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="my-3 w-4/12 pr-6">
            <div className="mb-4 h-auto w-full rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-5 text-xl font-bold">Habilidades</h2>
              <SkillsProfile
                isEditing={isEditing}
                skillsObj={profileData.skills}
                onChangeSkills={updateSkills}
              />
            </div>
            <div className="mb-4 h-auto w-full rounded-lg bg-white p-6 shadow-md">
              <div className="flex w-full items-center justify-between">
                <h2 className="text-xl font-bold">Idiomas</h2>
                {isEditing && (
                  <button
                    type="button"
                    className="flex items-center rounded-md bg-freeland px-3 py-2 text-white"
                    onClick={() => setNewLang(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="white"
                      className="mr-2 size-5 text-white"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>{' '}
                    Idiomas
                  </button>
                )}
              </div>
              <LangProfile isEditing={isEditing} langUser={profileData.lang} />
            </div>
            {newLang && (
              <FormEditLang
                open={newLang}
                onChangeOpen={setNewLang}
                data={newLangUser}
                onChangeLang={(newLanguage: LangUserProps) =>
                  setProfileData({
                    ...profileData,
                    lang: [...profileData.lang, newLanguage],
                  })
                }
              />
            )}
          </div>
          <div className="my-3 w-8/12 rounded-lg bg-white p-6 shadow-md">
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
                  onChangeHistory={(newHis: HistoryUserProps) =>
                    setProfileData({
                      ...profileData,
                      history: [...profileData.history, newHis],
                    })
                  }
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

          <div className="my-3 w-full rounded-lg bg-white p-6 shadow-md">
            <div className="w-full">
              <div className="flex w-full justify-between">
                <h2 className="mb-5 text-xl font-bold">Certificados</h2>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setNewCerti(true)}
                    className="mb-8 mt-4 rounded bg-freeland px-4 py-2 text-white hover:bg-green-500"
                  >
                    Añadir Certificados
                  </button>
                )}
              </div>

              {newCerti && (
                <FormEditCerti
                  open={newCerti}
                  onChangeOpen={setNewCerti}
                  data={newCertiUser}
                  onChangeHistory={(newCert: CertiUserProps) =>
                    setProfileData({
                      ...profileData,
                      certi: [...profileData.certi, newCert],
                    })
                  }
                />
              )}

              {profileData.certi &&
                profileData.certi.map((certi) => {
                  return (
                    <CertiProfile
                      key={certi.id}
                      certiUser={certi}
                      edit={isEditing}
                      onChangeCertiUser={changeCertiUser}
                      deleteCerti={deteleCerti}
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
