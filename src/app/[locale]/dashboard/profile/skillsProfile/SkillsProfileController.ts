import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export interface SkillsProfileControllerProps {
  isEditing: boolean;
  skillsObj: string[];
  onChangeSkills: (updateSkills: string[]) => void;
}

const SkillsProfileController = (props: SkillsProfileControllerProps) => {
  const { isEditing, skillsObj, onChangeSkills } = props;
  const t = useTranslations();
  const [skillsData, setSkillsData] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    if (skillsObj) {
      setSkillsData(skillsObj);
    }
  }, [skillsObj]);

  useEffect(() => {
    if (skillsData && skillsData.length > 0) {
      onChangeSkills(skillsData);
    }
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
    t,
  };
};

export default SkillsProfileController;
