'use client';

import { useParams } from 'next/navigation'; // Use useParams from next/navigation
import React from 'react';

import Profile from '../../profile/page';

const UserId = () => {
  const { userId } = useParams();
  return <Profile userId={userId} />;
};

export default UserId;
