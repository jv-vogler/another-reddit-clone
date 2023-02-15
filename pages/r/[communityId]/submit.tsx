import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/clientApp';
import PageContent from '@/components/Layout/PageContent';
import NewPostForm from '@/components/Posts/NewPostForm';
import useCommunityData from '@/hooks/useCommunityData';
import About from '@/components/Community/About';

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const { communityStateValue } = useCommunityData();

  return (
    <PageContent maxWidth="1060px">
      <>
        <Box p="14p 0" borderBottom="1px solid" borderColor="white">
          <Text fontWeight={600}>Create a new post</Text>
        </Box>
        {user && (
          <NewPostForm
            user={user}
            communityImageURL={communityStateValue.currentCommunity?.imageURL}
          />
        )}
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}{' '}
      </>
    </PageContent>
  );
};

export default SubmitPostPage;
