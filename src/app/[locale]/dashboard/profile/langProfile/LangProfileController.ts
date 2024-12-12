import { useEffect, useState } from 'react';

import useFormatDate from '@/hooks/useFormatDate';

import type { LangUserProps } from './LangProfile';

export interface LangControllerProps {
  langUser: LangUserProps;
  edit: boolean;
  onChangeLangUser: (props: LangUserProps) => void;
  deleteLang: (props: LangUserProps) => void;
}

const LangProfileController = (props: LangControllerProps) => {
  const { onChangeLangUser, edit, deleteLang } = props;
  const [langUser, setLangUser] = useState<LangUserProps>(props.langUser);
  const [editLang, setEditLang] = useState<boolean>(false);
  const isEdit = edit;
  const fromYear = useFormatDate(langUser.fromDate);
  const toYear = useFormatDate(langUser.toDate);

  const isEditLang = () => {
    setEditLang(true);
  };

  useEffect(() => {
    onChangeLangUser(langUser);
  }, [langUser]);

  const onDeleteLang = () => {
    deleteLang(langUser);
  };

  return {
    langUser,
    editLang,
    isEdit,
    fromYear,
    toYear,
    setEditLang,
    isEditLang,
    setLangUser,
    onDeleteLang,
  } as const;
};

export default LangProfileController;
