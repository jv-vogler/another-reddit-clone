import React, { useRef, useState } from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Flex, Icon } from '@chakra-ui/react';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { BiPoll } from 'react-icons/bi';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { Post } from '@/atoms/postsAtom';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '@/firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import useSelectFile from '@/hooks/useSelectFile';

type NewPostFormProps = {
  user: User;
  communityImageURL?: string;
};

const formTabs: TabItemType[] = [
  { title: 'Post', icon: IoDocumentText },
  { title: 'Images & Video', icon: IoImageOutline },
  { title: 'Link', icon: BsLink45Deg },
  { title: 'Poll', icon: BiPoll },
  { title: 'Talk', icon: BsMic },
];

export type TabItemType = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ user, communityImageURL }) => {
  const router = useRouter();
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [textInputs, setTextInputs] = useState({
    title: '',
    body: '',
  });

  const handleCreatePost = async () => {
    const { communityId } = router.query;
    const newPost: Post = {
      communityId: communityId as string,
      creatorId: user.uid,
      creatorDisplayName: user.email!.split('@')[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
      communityImageURL: communityImageURL || '',
    };

    setLoading(true);
    try {
      const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, 'data_url');
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }
      router.back();
    } catch (error: any) {
      console.error('handleCreatePost error', error.message);
      setError(true);
    }
    setLoading(false);
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;
    setTextInputs(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map(item => (
          <TabItem
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === 'Post' && (
          <TextInputs
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === 'Images & Video' && (
          <ImageUpload
            selectedFile={selectedFile}
            onSelectedImage={onSelectFile}
            selectedFileRef={selectedFileRef}
            setSelectedTab={setSelectedTab}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error creating post!</AlertTitle>
        </Alert>
      )}
    </Flex>
  );
};
export default NewPostForm;
