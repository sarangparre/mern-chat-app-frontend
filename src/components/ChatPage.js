import { Box, Flex, Spacer } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import ChatBox from "./ChatBox";
import MyChats from "./MyChats";
import SideDrawer from "./miscellaneous/SideDrawer";
export default function Chats() {

  const { user } = ChatState();

  const [fetchAgain, setFetchAgain] = useState(false)
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer setFetchAgain={setFetchAgain} />}
      <Box h="91.5vh" p="10px">
        <Flex>
          {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
          <Spacer />
          {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Flex>
      </Box>
    </div>
  );
}
