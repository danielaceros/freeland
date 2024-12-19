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
  const { isEditing, langList, deleteLang } = LangProfileController(props);

  return (
    <div className="h-28">
      {langList ? (
        <div className="flex w-full">
          <div className="flex w-full flex-wrap space-x-2 overflow-x-auto pt-3">
            {langList &&
              langList.length > 0 &&
              langList.map((langU: LangUserProps, i: number) => (
                <div
                  key={`${langU}-${i.toString()}`}
                  className="mb-2 mr-2 rounded-full bg-freeland px-2 py-1 text-sm font-medium text-white"
                >
                  {langU.lang.toUpperCase()} ({langU.level.toUpperCase()})
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => deleteLang(langU)}
                      className="ml-1 text-white hover:text-zinc-600 focus:outline-none"
                    >
                      &times;
                    </button>
                  )}
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
