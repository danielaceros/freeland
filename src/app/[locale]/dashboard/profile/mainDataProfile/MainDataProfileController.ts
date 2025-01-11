import { useTranslations } from 'next-intl';

import type { ProfileDataInterface } from '../page';

export interface MainDataProfileControllerProps {
  profileData: ProfileDataInterface;
  changeInput: (field: string, dataInput: any) => void;
  changeProfileImage: (dataInput: any) => void;
  changeProfileImageBg: (dataInput: any) => void;
}
const MainDataProfileController = (props: MainDataProfileControllerProps) => {
  const { profileData, changeInput, changeProfileImage, changeProfileImageBg } =
    props;
  const t = useTranslations();
  return {
    profileData,
    t,
    changeInput,
    changeProfileImage,
    changeProfileImageBg,
  };
};

export default MainDataProfileController;
