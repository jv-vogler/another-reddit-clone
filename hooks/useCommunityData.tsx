/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Community, CommunitySnippet, communityState } from '@/atoms/communitiesAtom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { collection, doc, getDoc, getDocs, increment, writeBatch } from 'firebase/firestore';
import { authModalState } from '@/atoms/authModalAtom';
import { useRouter } from 'next/router';

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const setAuthModalState = useSetRecoilState(authModalState);

  const onJoinOrLeaveCommunity = (communityData: Community, isJoined: boolean) => {
    if (!user) {
      setAuthModalState({ open: true, view: 'login' });
      return;
    }

    setLoading(true);
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

  const getMySnippets = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetDocs.docs.map(doc => ({ ...doc.data() }));
      setCommunityStateValue(prev => ({ ...prev, mySnippets: snippets as CommunitySnippet[] }));
    } catch (error: any) {
      console.error('getMySnippetsError', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const joinCommunity = async (communityData: Community) => {
    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || '',
      };

      // adds the community snippet to the user
      batch.set(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id),
        newSnippet
      );

      // updates the number of members in the community
      batch.update(doc(firestore, 'communities', communityData.id), {
        numberOfMembers: increment(1),
      });

      await batch.commit();

      // update recoil state
      setCommunityStateValue(prev => ({ ...prev, mySnippets: [...prev.mySnippets, newSnippet] }));
    } catch (error: any) {
      console.error('joinCommunity error', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    // batch write
    try {
      const batch = writeBatch(firestore);

      // deleting the community snippet from user
      batch.delete(doc(firestore, `users/${user?.uid}/communitySnippets`, communityId));

      // updates the number of members in the community
      batch.update(doc(firestore, 'communities', communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      // update recoil state
      setCommunityStateValue(prev => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(item => item.communityId !== communityId),
      }));
    } catch (error: any) {
      console.error('leaveCommunity error', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const getCommunityData = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, 'communities', communityId);
      const communityDoc = await getDoc(communityDocRef);

      setCommunityStateValue(prev => ({
        ...prev,
        currentCommunity: { id: communityDoc.id, ...communityDoc.data() } as Community,
      }));
    } catch (error) {
      console.error('getCommunityData error', error);
    }
  };

  useEffect(() => {
    if (!user) {
      setCommunityStateValue(prev => ({
        ...prev,
        mySnippets: [],
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  useEffect(() => {
    const { communityId } = router.query;

    if (communityId && !communityStateValue.currentCommunity) {
      getCommunityData(communityId as string);
    }
  }, [router.query, communityStateValue.currentCommunity]);

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  };
};
export default useCommunityData;
