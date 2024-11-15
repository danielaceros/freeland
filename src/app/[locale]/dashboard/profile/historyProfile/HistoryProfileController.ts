import { useEffect, useState } from 'react';

import useFormatDate from '@/hooks/useFormatDate';

import type { HistoryUserProps } from './HistoryProfile';

export interface HistoryControllerProps {
  historyUser: HistoryUserProps;
  edit: boolean;
  onChangeHistoryUser: (props: HistoryUserProps) => void;
  deleteHistory: (props: HistoryUserProps) => void;
}

const HistoryProfileController = (props: HistoryControllerProps) => {
  const { onChangeHistoryUser, edit, deleteHistory } = props;
  const [historyUser, setHistoryUser] = useState<HistoryUserProps>(
    props.historyUser,
  );
  const [editHistory, setEditHistory] = useState<boolean>(false);
  // const [isDeleteHistory, setIsDeleteHistory] = useState<boolean>(false);
  const isEdit = edit;
  const fromYear = useFormatDate(historyUser.fromDate);
  const toYear = useFormatDate(historyUser.toDate);

  const isEditHistory = () => {
    setEditHistory(true);
  };

  useEffect(() => {
    onChangeHistoryUser(historyUser);
  }, [historyUser]);

  const onDeleteHistory = () => {
    deleteHistory(historyUser);
  };

  return {
    historyUser,
    editHistory,
    isEdit,
    fromYear,
    toYear,
    setEditHistory,
    isEditHistory,
    setHistoryUser,
    onDeleteHistory,
  } as const;
};

export default HistoryProfileController;
