import { ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Image,
  Text
} from "@chakra-ui/react";
import React from "react";


function ProfileModal({ user, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader align="center">{user?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody align="center">
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user?.pic}
              alt={user?.name}
            />
            <Text fontFamily="Montserrat">Email: {user?.email}</Text>
          </ModalBody>
            <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
            </Button>
            </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal;
