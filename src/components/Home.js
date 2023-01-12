import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
} from "@chakra-ui/react";
import "./Home.css";
import Login from "./Login";
import Signup from "./Signup";
import { useHistory } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState("");
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <>
      <Container maxW="xl" centerContent>
        <Box
          p={3}
          bg="white"
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Center>
            <Text fontSize="4xl" fontFamily="Anton">
              Chat Application
            </Text>
          </Center>
        </Box>
        <Box fontFamily="Montserrat" bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
          <Tabs isFitted variant="soft-rounded">
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
}
