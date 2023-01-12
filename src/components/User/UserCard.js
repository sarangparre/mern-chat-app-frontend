import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

function UserList({ user, handleFunction }) {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
    <Flex>
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
      <Text>{user.name}</Text>
      <Text fontSize="xs">
        <b>Email: </b>
        {user.email}
      </Text>
      </Box>
        </Flex>
    </Box>
  );
}

export default UserList