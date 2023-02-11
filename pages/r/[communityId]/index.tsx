import React from 'react';
import { firestore } from '@/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import { Community } from '@/atoms/communitiesAtom';
import safeJsonStringify from 'safe-json-stringify';
import NotFound from '@/components/Community/NotFound';
import Header from '@/components/Community/Header';
import PageContent from '@/components/Layout/PageContent';
import CreatePostLink from '@/components/Community/CreatePostLink';
import Posts from '@/components/Posts/Posts';

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  if (!communityData) {
    return <NotFound />;
  }
  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <div>RIGHT</div>
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(firestore, 'communities', context.query.communityId as string);
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }))
          : '',
      },
    };
  } catch (error) {
    console.error('getServerSideProps error', error);
  }
}

export default CommunityPage;
