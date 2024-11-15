import { useEffect, useState } from 'react';

import type { ProfileDataInterface } from '../page';

export interface SkillsProfileControllerProps {
  isEditing: boolean;
  profileData: ProfileDataInterface;
  onChangeSkills: (updateSkills: ProfileDataInterface) => void;
}

const SkillsProfileController = (props: SkillsProfileControllerProps) => {
  const { isEditing, profileData, onChangeSkills } = props;
  const [skillsData, setSkillsData] = useState<string[]>(profileData.skills);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    onChangeSkills({ ...profileData, skills: skillsData });
  }, [skillsData]);

  const handleKeyDown = (event: any) => {
    const skills = skillsData || [];
    if (inputValue !== '' && event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      if (inputValue !== '' && !skills.includes(inputValue.trim())) {
        setSkillsData([...skills, inputValue.trim()]);
        setInputValue('');
      }
    }
  };

  const removeSkill = (skillToRemove: any) => {
    setSkillsData(skillsData.filter((skills) => skills !== skillToRemove));
  };
  return {
    skillsData,
    inputValue,
    isEditing,
    profileData,
    handleKeyDown,
    removeSkill,
    setInputValue,
  };
};

export default SkillsProfileController;
