import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroup from "./miscellaneous/UpdateGroup";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import typingAnime from '../animations/88136-typing.json'
import io from "socket.io-client";
import Lottie from "react-lottie"
import "./style.css";
import { backend_url } from "../url";
import { AiOutlineSend } from "react-icons/ai"
import sent from "./assets/sent.mp3"
import received from "./assets/recieved.mp3"

const ENDPOINT = backend_url;
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessages, setNewMessages] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false)
  const toast = useToast();
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typingAnime,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }

  }

  const typingHandler = (e) => {
    setNewMessages(e.target.value);
    if(!socketConnected) return;
    if(!typing){
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if(timeDiff >= timerLength && typing){
        socket.emit("stop typing", selectedChat._id);
        setTyping(false)
      }
    }, timerLength);
  };

  const fetchMessages = async () => {
    if (selectedChat?._id === undefined) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${backend_url}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessages) {
      socket.emit("stop typing", selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessages("");
        const { data } = await axios.post(
          `${backend_url}/api/message`,
          {
            content: newMessages,
            chatId: selectedChat._id,
          },
          config
        );
        const audio = new Audio(sent);
        audio.play()
        socket.emit('new message', data)
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop typing", () => setIsTyping(false))
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat
  }, [selectedChat]);

  
  useEffect(() => {
    socket.on("message recieved", (newMessages) => {
      if(!selectedChatCompare || selectedChatCompare._id !== newMessages.chat._id){
        if(!notification.includes(newMessages)){
          const audio1 = new Audio(received);
          audio1.play();
          setNotification([newMessages, ...notification]);
          setFetchAgain(!fetchAgain)
        }
      }else{
        setMessages([...messages, newMessages])
      }
    })
  })

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Montserrat"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroup
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <div style={{width: "100%", display: "flex"}}>
            {isTyping ? <span>
              <Lottie 
            width={80}
            options={defaultOptions} /></span> : null}
            </div>
            <FormControl
              display="flex"
              alignItems="center"
              onKeyDown={sendMessage}
              >
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessages}
                mt={2}
                mr={2}
              />
              <span mt={2} onClick={sendMessage}>
              <AiOutlineSend size={25} />
              </span>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box h="100%">
          <Flex align="center" justify="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Montserrat">
              Click on user to start chatting.
            </Text>
          </Flex>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
