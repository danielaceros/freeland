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
    // Detecta la tecla Enter y añade la habilidad si no está vacía y no existe en el array
    if (inputValue !== '' && event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      if (inputValue !== '' && !skillsData.includes(inputValue.trim())) {
        setSkillsData([...skillsData, inputValue.trim()]);
        setInputValue(''); // Limpia el campo de entrada
      }
    }
  };

  const removeSkill = (skillToRemove: any) => {
    // Elimina la habilidad seleccionada del array
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
