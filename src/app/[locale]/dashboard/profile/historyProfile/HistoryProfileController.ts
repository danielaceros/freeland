import { useEffect, useState } from 'react';

import useFormatDate from '@/hooks/useFormatDate';

import type { HistoryUserProps } from './HistoryProfile';

export interface HistoryControllerProps {
  historyUser: HistoryUserProps;
  edit: boolean;
  onChangeHistoryUser: (props: HistoryUserProps) => void;
}

const HistoryProfileController = (props: HistoryControllerProps) => {
  const { onChangeHistoryUser, edit } = props;
  const [historyUser, setHistoryUser] = useState<HistoryUserProps>(
    props.historyUser,
  );
  const [editHistory, setEditHistory] = useState<boolean>(false);
  const [deleteHistory, setDeleteHistory] = useState<boolean>(false);
  const isEdit = edit;
  const fromYear = useFormatDate(historyUser.fromDate);
  const toYear = useFormatDate(historyUser.toDate);

  const isEditHistory = () => {
    setEditHistory(true);
  };

  const isDeleteHistory = () => {
    setDeleteHistory(true);
  };

  useEffect(() => {
    onChangeHistoryUser(historyUser);
  }, [historyUser]);

  return {
    historyUser,
    editHistory,
    deleteHistory,
    isEdit,
    fromYear,
    toYear,
    setEditHistory,
    isDeleteHistory,
    isEditHistory,
    setHistoryUser,
  } as const;
};

export default HistoryProfileController;
