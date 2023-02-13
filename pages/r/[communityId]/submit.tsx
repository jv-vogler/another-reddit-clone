import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import PageContent from '@/components/Layout/PageContent';
import NewPostForm from '@/components/Posts/NewPostForm';
import { useRecoilValue } from 'recoil';
import { communityState } from '@/atoms/communitiesAtom';

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const communityStateValue = useRecoilValue(communityState);

  return (
    <PageContent maxWidth="1060px">
      <>
        <Box p="14p 0" borderBottom="1px solid" borderColor="white">
          <Text fontWeight={600}>Create a new post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      <></>
    </PageContent>
  );
};

export default SubmitPostPage;
