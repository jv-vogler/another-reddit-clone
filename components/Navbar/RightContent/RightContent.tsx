import React from 'react';
import { Flex } from '@chakra-ui/react';
import { signOut, User } from 'firebase/auth';
import { auth } from '@/firebase/clientApp';
import AuthModal from '@/components/Modal/Auth/AuthModal';
import AuthButtons from './AuthButtons';

type RightContentProps = {
  user: User | undefined | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex justify="center" align="center">
        {user ? <button onClick={() => signOut(auth)}>Logout</button> : <AuthButtons />}
      </Flex>
    </>
  );
};
export default RightContent;
