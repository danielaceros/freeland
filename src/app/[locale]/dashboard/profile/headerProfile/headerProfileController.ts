import type { ProfileDataInterface } from '../page';

export interface HeaderProfileControllerProps {
  profileData: ProfileDataInterface;
  bg: File | null;
}
const headerProfileController = (props: HeaderProfileControllerProps) => {
  const { profileData, bg } = props;
  return {
    profileData,
    bg,
  };
};

export default headerProfileController;
