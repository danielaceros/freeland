import React from 'react';

import SkillsProfileController, {
  type SkillsProfileControllerProps,
} from './SkillsProfileController';

const SkillsProfile = (props: SkillsProfileControllerProps) => {
  const {
    skillsData,
    inputValue,
    isEditing,
    skillsObj,
    t,
    handleKeyDown,
    removeSkill,
    setInputValue,
  } = SkillsProfileController(props);

  return (
    <div className="md:h-28">
      {isEditing ? (
        <>
          <div className="w-full">
            <input
              type="text"
              id="skills"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('profile.writeSkill')}
              className="w-full rounded border border-gray-300 p-2 focus:border-freeland focus:ring-freeland"
            />
          </div>
          <div className="flex max-h-20 w-full flex-wrap space-x-2 overflow-x-auto pt-3">
            {skillsData.length > 0
              ? skillsData.map((skill: string, i: number) => (
                  <div
                    key={`${skill}-${i.toString()}`}
                    className="mb-2 mr-2 flex flex-wrap items-center rounded-full bg-freeland px-2 py-1 text-sm font-medium text-white"
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
                ))
              : skillsObj &&
                skillsObj.length > 0 &&
                skillsObj.map((skill: string, i: number) => (
                  <div
                    key={`${skill}-${i.toString()}`}
                    className="mb-2 mr-2 flex flex-wrap items-center rounded-full bg-freeland px-2 py-1 text-sm font-medium text-white"
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
        <div className="flex max-h-28 w-full flex-wrap space-x-2 overflow-x-auto pt-3">
          {skillsObj &&
            skillsObj.map((skill: string, i: number) => (
              <div
                key={`${skill}-${i.toString()}`}
                className="mb-2 mr-2 rounded-full bg-freeland px-2 py-1 text-sm font-medium text-white"
              >
                {skill.toUpperCase()}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SkillsProfile;
