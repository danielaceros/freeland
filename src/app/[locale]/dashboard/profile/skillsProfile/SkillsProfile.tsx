import React from 'react';

import SkillsProfileController, {
  type SkillsProfileControllerProps,
} from './SkillsProfileController';

const SkillsProfile = (props: SkillsProfileControllerProps) => {
  const {
    skillsData,
    inputValue,
    isEditing,
    profileData,
    handleKeyDown,
    removeSkill,
    setInputValue,
  } = SkillsProfileController(props);
  return (
    <>
      <h2 className="mb-5 text-xl font-bold">Habilidades</h2>
      {isEditing ? (
        <>
          <div className="w-full">
            <input
              type="text"
              id="skills"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe una habilidad y presiona Enter"
              className="w-full rounded border border-gray-300 p-2"
            />
          </div>
          <div className="flex pt-3">
            {skillsData &&
              skillsData.map((skill: string, i: number) => (
                <div
                  key={`${skill}-${i.toString()}`}
                  className="mb-2 mr-2 flex items-center rounded-full bg-freeland px-2 py-1 text-sm font-medium text-white"
                >
                  {skill.toUpperCase()}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 text-white hover:text-zinc-600 focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className="flex pt-3">
          {profileData.skills &&
            profileData.skills.map((skill: string, i: number) => (
              <div
                key={`${skill}-${i.toString()}`}
                className="mb-2 mr-2 rounded-full bg-freeland px-2 py-1 text-sm font-medium text-white"
              >
                {skill.toUpperCase()}
              </div>
            ))}
        </div>
      )}
    </>
  );
};

export default SkillsProfile;
