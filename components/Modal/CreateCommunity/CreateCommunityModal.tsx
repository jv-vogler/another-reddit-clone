import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Input,
  Stack,
  Checkbox,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { BsFillEyeFill, BsFilePersonFill } from 'react-icons/bs';
import { HiLockClosed } from 'react-icons/hi';

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ open, handleClose }) => {
  const [communityName, setCommunityName] = useState('');
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState('public');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 21) return;

    setCommunityName(e.target.value);
    setCharsRemaining(21 - e.target.value.length);
  };

  const onCommunityTypeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityType(e.target.name);
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" flexDir="column" fontSize={15} padding={3}>
            Create a community
          </ModalHeader>
          <Box padding="0 3px">
            <ModalCloseButton />
            <ModalBody display="flex" flexDir="column" padding="10px">
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text fontSize={11} color="gray.500">
                Community names including capitalization cannot be changed
              </Text>
              <Text pos="relative" top="30px" left="10px" width="20px" color="gray.400">
                r/
              </Text>
              <Input
                pos="relative"
                value={communityName}
                size="sm"
                pl="22px"
                onChange={handleChange}
                spellCheck={false}
              />
              <Text fontSize="9pt" color={charsRemaining === 0 ? 'red' : 'gray.500'}>
                {charsRemaining} Characters remaining
              </Text>
              <Box margin={'4px 0'}>
                <Text fontWeight={600} fontSize={15}>
                  Community Type
                </Text>
                {/* checkbox */}
                <Stack spacing={2}>
                  <Checkbox
                    name="public"
                    isChecked={communityType === 'public'}
                    onChange={onCommunityTypeChanged}
                  >
                    <Flex align="center">
                      <Icon as={BsFilePersonFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Public
                      </Text>
                      <Text fontSize="8pt" color="gray.500">
                        Anyone can view, post, and comment to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="restricted"
                    isChecked={communityType === 'restricted'}
                    onChange={onCommunityTypeChanged}
                  >
                    <Flex align="center">
                      <Icon as={HiLockClosed} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Restricted
                      </Text>
                      <Text fontSize="8pt" color="gray.500">
                        Anyone can view this community, but only approved users can post
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="private"
                    isChecked={communityType === 'private'}
                    onChange={onCommunityTypeChanged}
                  >
                    <Flex align="center">
                      <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Private
                      </Text>
                      <Text fontSize="8pt" color="gray.500">
                        Only approved users can view and submit for this community
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter bg="gray.100" borderRadius="0 0 10px 10px">
            <Button variant="outline" height="30px" mr={3} onClick={handleClose}>
              Close
            </Button>
            <Button height="30px" onClick={() => {}}>Create Community</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModal;
