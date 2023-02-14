/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { auth, firestore } from '@/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { Post } from '@/atoms/postsAtom';
import { User } from 'firebase/auth';
import About from '@/components/Community/About';
import useCommunityData from '@/hooks/useCommunityData';
import Comments from '@/components/Posts/Comments/Comments';
import PageContent from '@/components/Layout/PageContent';
import PostItem from '@/components/Posts/PostItem';
import usePosts from '@/hooks/usePosts';

const PostPage = () => {
  const [user] = useAuthState(auth);
  const { postStateValue, setPostStateValue, onDeletePost, onVote } = usePosts();
  const { communityStateValue } = useCommunityData();
  const router = useRouter();

  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, 'posts', postId);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue(prev => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error: any) {
      console.error('fetchPost error', error);
    }
  };

  useEffect(() => {
    const { pid } = router.query;

    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue]);

  return (
    <PageContent>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
            userVoteValue={
              postStateValue.postVotes.find(item => item.postId === postStateValue.selectedPost?.id)
                ?.voteValue
            }
          />
        )}
        <Comments
          user={user as User}
          communityId={communityStateValue.currentCommunity?.id as string}
          selectedPost={postStateValue.selectedPost}
        />
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}{' '}
      </>
    </PageContent>
  );
};

export default PostPage;
