import type { LangUserProps } from './LangProfile';

export interface LangControllerProps {
  langUser: LangUserProps[];
  isEditing: boolean;
}

const LangProfileController = (props: LangControllerProps) => {
  const { isEditing, langUser } = props;

  return {
    langUser,
    isEditing,
  } as const;
};

export default LangProfileController;
