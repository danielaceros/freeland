import React from 'react';

import MainDataProfileController, {
  type MainDataProfileControllerProps,
} from './MainDataProfileController';

const MainDataProfile = (props: MainDataProfileControllerProps) => {
  const {
    profileData,
    t,
    changeInput,
    changeProfileImage,
    changeProfileImageBg,
  } = MainDataProfileController(props);
  return (
    <>
      <div className="my-3 w-full rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex w-full">
          <div className="w-full">
            <input
              type="text"
              value={profileData.name || ''}
              onChange={(e) => changeInput('name', e.target.value)}
              className="rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland md:w-6/12"
              placeholder={t('profile.yourName')}
            />
            <input
              type="text"
              value={profileData.surname || ''}
              onChange={(e) => changeInput('surname', e.target.value)}
              className="ml-1 rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland md:w-6/12"
              placeholder={t('profile.yourSurname')}
            />
            <div className="mt-5 w-full">
              <p className="block text-gray-700">
                {t('profile.uploadImage')}: (300px X 300px)
              </p>
              <input
                id="picture"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    changeProfileImage(file);
                  }
                }}
                className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
              />
            </div>
            <div className="mt-5 w-full">
              <p className="block text-gray-700">{t('profile.uploadBg')}</p>
              <input
                id="picture"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    changeProfileImageBg(file);
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
            <p>{t('profile.email')}: </p>
            <input
              type="text"
              value={profileData.email || ''}
              onChange={(e) => changeInput('email', e.target.value)}
              className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
              placeholder={`Enter ${'email'}`}
            />
          </div>
          <div className="mb-4 ml-5  w-4/12">
            <p>{t('profile.position')}: </p>
            <input
              type="text"
              value={profileData.position || ''}
              onChange={(e) => changeInput('position', e.target.value)}
              className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
              placeholder={`Enter ${'position'}`}
            />
          </div>
          <div className="mb-4 ml-5  w-4/12">
            <p>{t('profile.phone')}: </p>
            <input
              type="text"
              value={profileData.phone || ''}
              onChange={(e) => changeInput('phone', e.target.value)}
              className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
              placeholder={`Enter ${'phone'}`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainDataProfile;
