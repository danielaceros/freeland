import React from 'react';

import headerProfileController, {
  type HeaderProfileControllerProps,
} from './headerProfileController';

const HeaderProfile = (props: HeaderProfileControllerProps) => {
  const { profileData } = headerProfileController(props);
  return (
    <>
      <div
        className="relative h-[20vh] w-full bg-slate-500 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${profileData.profilePictureBackground})`,
        }}
      />
      {/* User Info */}
      <div className="mt-headerProfile flex items-center justify-center space-x-4 pb-3 sm:w-5/6 xl:w-4/6">
        {profileData.profilePicture && (
          <img
            src={profileData.profilePicture}
            alt="User Profile"
            className="z-30 mt-headerProfile size-52 rounded-full border-2 border-white"
          />
        )}
        <div className="mt-14 w-3/6">
          <p className="text-xl font-bold">{`${profileData.name} ${profileData.surname}`}</p>
          <p className="text-lg opacity-75">{`${profileData.position}`}</p>
        </div>
      </div>
    </>
  );
};

export default HeaderProfile;
