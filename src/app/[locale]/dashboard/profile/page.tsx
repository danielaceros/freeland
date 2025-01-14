'use client';

import type { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'; // Import Firebase Storage functions
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'; // Import toast for notifications

import BarTop from '@/components/common/BarTop';
import Menu from '@/components/common/Menu';
import { changeUserData } from '@/store/userStore';
import { loadDataUser, loadUser, sortedDates } from '@/utils/utils';

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
import MainDataProfile from './mainDataProfile/MainDataProfile';
import NumOffersProfile from './numOffersProfile/NumOffersProfile';
import SkillsProfile from './skillsProfile/SkillsProfile';
import VisitProfile from './visitProfile/VisitProfile';

export interface HistoyProfile {
  id: string;
  rol: string;
  company: string;
  fromDate: {
    seconds: Number;
    nanoseconds: Number;
  };
  toDate: {
    seconds: Number;
    nanoseconds: Number;
  };
  description: string;
}

export interface CertiProfileData {
  id: string;
  certiTitle: string;
  company: string;
  fromDate: {
    seconds: Number;
    nanoseconds: Number;
  };
  toDate: {
    seconds: Number;
    nanoseconds: Number;
  };
  description: string;
}

export interface ProfileDataInterface {
  name: string;
  surname: string | null;
  email: string | null;
  nick: string | null;
  visits: number;
  profilePicture: string | null;
  profilePictureBackground: string | null;
  position: string;
  phone: string;
  skills: string[];
  history: HistoyProfile[];
  certi: CertiProfileData[];
  lang: LangUserProps[];
}

const isEmpty = (obj: Record<string, any>): boolean => {
  return JSON.stringify(obj) === '{}';
};

export default function Profile(userId: any) {
  const dispatch = useDispatch();
  const t = useTranslations();
  const userViewId = userId.userId;
  const [isLoadData, setIsLoadData] = useState<boolean>(false);
  const userData = useSelector((state: any) => state.user.data) || null;
  const userDataU = useSelector((state: any) => state.user.userData) || null;
  const hasLoaded = useSelector((state: any) => state.user.loaded) || null;
  const userDataProfile =
    useSelector((state: any) => state.user.userDataProfile) || null;

  const [user, setUser] = useState<User | null>(null);

  const [oldProfileData, setOldProfileData] = useState<ProfileDataInterface>(
    userData || ({} as ProfileDataInterface),
  );
  const [profileData, setProfileData] = useState<ProfileDataInterface>(
    userData || ({} as ProfileDataInterface),
  );
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
    fromDate: {
      seconds: 0,
      nanoseconds: 0,
    },
    toDate: {
      seconds: 0,
      nanoseconds: 0,
    },
    description: '',
  };
  const newCertiUser = {
    id: '',
    certiTitle: '',
    company: '',
    fromDate: {
      seconds: 0,
      nanoseconds: 0,
    },
    toDate: {
      seconds: 0,
      nanoseconds: 0,
    },
    description: '',
  };
  const newLangUser = {
    id: '',
    lang: '',
    level: '',
  };

  const visitPerfil = async (id: string, data: any) => {
    if (id) {
      const userDocRef = doc(db, 'users', id);

      const visit = !data.visits ? 0 : data.visits;
      const newData = { ...data, visits: visit + 1 };
      await setDoc(
        userDocRef,
        {
          ...newData,
        },
        { merge: true },
      );
    }
  };
  const loadData = () => {
    setProfileData(userData);
    setOldProfileData(userData);
    setUser(userDataU);
  };

  useEffect(() => {
    loadUser(dispatch);
    setIsLoadData(true);
  }, []);

  useEffect(() => {
    if (userViewId) {
      loadDataUser(dispatch, userViewId);
    } else {
      setProfileData(profileData);
      dispatch(changeUserData(null));
    }
  }, [userViewId]);

  useEffect(() => {
    if (!isEmpty(userDataProfile)) {
      setProfileData(userDataProfile);
      dispatch(changeUserData(null));
      visitPerfil(userViewId, userDataProfile);
    }
  }, [userDataProfile]);

  useEffect(() => {
    if (isLoadData && !isEmpty(userData)) {
      loadData();
      setIsLoadData(false);
    }
  }, [isLoadData, userData]);

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
          setProfileData({
            ...profileData,
            profilePicture: downloadURL || profileData.profilePicture,
            profilePictureBackground:
              downloadURLB || profileData.profilePictureBackground,
          });
          dispatch(
            changeUserData({
              ...profileData,
              profilePicture: downloadURL || profileData.profilePicture,
              profilePictureBackground:
                downloadURLB || profileData.profilePictureBackground,
            }),
          );
        } else {
          await setDoc(userDocRef, profileData, { merge: true });
        }
        dispatch(changeUserData(profileData));
        setOldProfileData(profileData);

        toast.success(t('profile.profileUpdateOK'));
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating profile data:', error);
        toast.error(t('profile.profileUpdateKO'));
      }
    }
  };

  if (!user || !hasLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="loader" />
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
    setProfileData({
      ...profileData,
      history: sortedDates(updateHistory, 'fromDate', 'ASC'),
    });
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

  const updateLang = (newlangs: any) => {
    const langList = profileData.lang;
    if (langList) {
      setProfileData({ ...profileData, lang: [...profileData.lang, newlangs] });
    } else {
      setProfileData({ ...profileData, lang: [newlangs] });
    }
  };

  const updateHistory = (newHis: any) => {
    const historyList = profileData.history;
    if (historyList) {
      setProfileData({
        ...profileData,
        history: [...profileData.history, newHis],
      });
    } else {
      setProfileData({ ...profileData, history: [newHis] });
    }
  };

  const updateCerti = (newCert: any) => {
    const certiList = profileData.certi;
    if (certiList) {
      setProfileData({
        ...profileData,
        certi: [...profileData.certi, newCert],
      });
    } else {
      setProfileData({ ...profileData, certi: [newCert] });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Menu />
      <div className="max-h-screen flex-1 overflow-y-auto py-16">
        <BarTop />
        <div className="fixed bottom-0 right-0 z-40 flex w-full justify-end rounded-md bg-white px-4 py-2 shadow-top">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                className="ml-3 rounded bg-freeland px-4 py-2 font-bold text-white hover:bg-green-500"
              >
                {t('save')}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="hover:bg-red-800' rounded bg-red-600  px-4 py-2 font-bold text-white"
              >
                {t('cancel')}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`${isEditing ? 'bg-red-600 hover:bg-red-800' : 'bg-freeland hover:bg-green-500'} ${userViewId ? 'hidden' : 'block'} rounded  px-4 py-2 font-bold text-white `}
            >
              {isEditing ? t('cancel') : t('edit')}
            </button>
          )}
        </div>
        <div className="mb-3 w-full rounded-lg bg-white shadow-md">
          <HeaderProfile
            profileData={profileData}
            bg={profilePictureBackground}
          />
        </div>
        <main className="flex flex-wrap px-3 py-6 md:px-16">
          {isEditing && (
            <MainDataProfile
              profileData={profileData}
              changeInput={handleInputChange}
              changeProfileImage={setProfilePicture}
              changeProfileImageBg={setProfilePictureBackground}
            />
          )}

          <div className="w-full md:flex md:flex-wrap lg:flex-nowrap lg:space-x-5">
            <div className="flex flex-col md:w-full md:flex-row md:space-x-5 lg:w-6/12">
              <div className="w-full md:w-6/12">
                <div className="mb-4 h-auto w-full rounded-lg bg-white p-6 shadow-md">
                  <h2 className="mb-5 text-xl font-bold">Habilidades</h2>
                  <SkillsProfile
                    isEditing={isEditing}
                    skillsObj={profileData.skills}
                    onChangeSkills={updateSkills}
                  />
                </div>
              </div>
              <div className="w-full md:w-6/12">
                <div className="mb-4 h-auto w-full rounded-lg bg-white p-6 shadow-md">
                  <div className="flex w-full items-center justify-between">
                    <h2 className="mb-5 text-xl font-bold">
                      {t('profile.lang')}
                    </h2>
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
                        {t('profile.lang')}
                      </button>
                    )}
                  </div>
                  <LangProfile
                    isEditing={isEditing}
                    langUser={profileData.lang}
                    onChangeLang={(data: any) =>
                      setProfileData({ ...profileData, lang: data })
                    }
                  />
                </div>
                {newLang && (
                  <FormEditLang
                    open={newLang}
                    onChangeOpen={setNewLang}
                    data={newLangUser}
                    onChangeLang={(data) => updateLang(data)}
                  />
                )}
              </div>
            </div>
            <div className="flex space-x-5 md:w-full lg:w-6/12">
              <div className="w-6/12">
                <VisitProfile visit={profileData.visits} />
              </div>
              <div className="w-6/12">
                <NumOffersProfile />
              </div>
            </div>
          </div>
          <div className="my-3 w-full rounded-lg bg-white p-6 shadow-md">
            <div className="w-full">
              <div className="flex w-full justify-between">
                <h2 className="mb-5 text-xl font-bold">
                  {t('profile.experience')}
                </h2>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setNewHistory(true)}
                    className="mb-8 mt-4 rounded bg-freeland px-4 py-2 text-white hover:bg-green-500"
                  >
                    {`${t('profile.add')} ${t('profile.experience')}`}
                  </button>
                )}
              </div>

              {newHistory && (
                <FormEditHistory
                  open={newHistory}
                  onChangeOpen={setNewHistory}
                  data={newHistoryUser}
                  onChangeHistory={(data) => updateHistory(data)}
                />
              )}

              {profileData.history &&
                profileData.history.length > 0 &&
                sortedDates(profileData.history, 'fromDate', 'ASC').map(
                  (history: HistoryUserProps) => {
                    return (
                      <HistoryProfile
                        key={history.id}
                        historyUser={history}
                        edit={isEditing}
                        onChangeHistoryUser={changeHistoryUser}
                        deleteHistory={deteleHistory}
                      />
                    );
                  },
                )}
            </div>
          </div>

          <div className="my-3 w-full rounded-lg bg-white p-6 shadow-md">
            <div className="w-full">
              <div className="flex w-full justify-between">
                <h2 className="mb-5 text-xl font-bold">{t('profile.certi')}</h2>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setNewCerti(true)}
                    className="mb-8 mt-4 rounded bg-freeland px-4 py-2 text-white hover:bg-green-500"
                  >
                    {`${t('profile.add')} ${t('profile.certi')}`}
                  </button>
                )}
              </div>

              {newCerti && (
                <FormEditCerti
                  open={newCerti}
                  onChangeOpen={setNewCerti}
                  data={newCertiUser}
                  onChangeHistory={(data) => updateCerti(data)}
                />
              )}

              {profileData.certi &&
                profileData.certi.length > 0 &&
                sortedDates(profileData.certi, 'fromDate', 'ASC').map(
                  (certi) => {
                    return (
                      <CertiProfile
                        key={certi.id}
                        certiUser={certi}
                        edit={isEditing}
                        onChangeCertiUser={changeCertiUser}
                        deleteCerti={deteleCerti}
                      />
                    );
                  },
                )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
