import { useEffect, useState } from 'react';

import useFormatDate from '@/hooks/useFormatDate';

import type { CertiUserProps } from './CertiProfile';

export interface CertiControllerProps {
  certiUser: CertiUserProps;
  edit: boolean;
  onChangeCertiUser: (props: CertiUserProps) => void;
  deleteCerti: (props: CertiUserProps) => void;
}

const CertiProfileController = (props: CertiControllerProps) => {
  const { onChangeCertiUser, edit, deleteCerti } = props;
  const [certiUser, setCertiUser] = useState<CertiUserProps>(props.certiUser);
  const [editCerti, setEditCerti] = useState<boolean>(false);
  const isEdit = edit;
  const fromYear = useFormatDate(certiUser.fromDate);
  const toYear = useFormatDate(certiUser.toDate);

  const isEditCerti = () => {
    setEditCerti(true);
  };

  useEffect(() => {
    onChangeCertiUser(certiUser);
  }, [certiUser]);

  const onDeleteCerti = () => {
    deleteCerti(certiUser);
  };

  return {
    certiUser,
    editCerti,
    isEdit,
    fromYear,
    toYear,
    setEditCerti,
    isEditCerti,
    setCertiUser,
    onDeleteCerti,
  } as const;
};

export default CertiProfileController;
