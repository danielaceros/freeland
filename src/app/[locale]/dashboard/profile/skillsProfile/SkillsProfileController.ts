import { useEffect, useState } from 'react';

export interface SkillsProfileControllerProps {
  isEditing: boolean;
  skillsObj: string[];
  onChangeSkills: (updateSkills: string[]) => void;
}

const SkillsProfileController = (props: SkillsProfileControllerProps) => {
  const { isEditing, skillsObj, onChangeSkills } = props;
  const [skillsData, setSkillsData] = useState<string[]>(skillsObj);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    onChangeSkills(skillsData);
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
    skillsObj,
    handleKeyDown,
    removeSkill,
    setInputValue,
  };
};

export default SkillsProfileController;
