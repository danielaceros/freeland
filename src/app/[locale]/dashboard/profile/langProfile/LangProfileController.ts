import { useEffect, useState } from 'react';

import type { LangUserProps } from './LangProfile';

export interface LangControllerProps {
  langUser: LangUserProps[];
  isEditing: boolean;
}

const LangProfileController = (props: LangControllerProps) => {
  const { isEditing, langUser } = props;
  const [langList, setLangList] = useState<LangUserProps[]>([]);

  useEffect(() => {
    if (langUser) {
      setLangList(langUser);
    }
  }, [langUser]);

  const deleteLang = (langU: LangUserProps) => {
    const delLang = langUser.filter((lang) => lang.id !== langU.id);
    setLangList(delLang);
  };

  return {
    langUser,
    isEditing,
    langList,
    deleteLang,
  } as const;
};

export default LangProfileController;
