import React from 'react';

import LangProfileController, {
  type LangControllerProps,
} from './LangProfileController';

export interface LangUserProps {
  id: string;
  lang: string;
  level: string;
}

const LangProfile = (props: LangControllerProps) => {
  const { langUser } = LangProfileController(props);

  return (
    <div>
      {langUser ? (
        <div className="flex w-full">
          <div className="flex pt-3">
            {langUser &&
              langUser.map((skill: LangUserProps, i: number) => (
                <div
                  key={`${skill}-${i.toString()}`}
                  className="mb-2 mr-2 rounded-full bg-freeland px-2 py-1 text-sm font-medium text-white"
                >
                  {skill.lang.toUpperCase()} ({skill.level.toUpperCase()})
                </div>
              ))}
          </div>
        </div>
      ) : (
        <p>Aun nada</p>
      )}
    </div>
  );
};

export default LangProfile;
