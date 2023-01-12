import { Avatar, Tooltip } from '@chakra-ui/react'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
import "./style.css"
function ScrollableChat({ messages }) {
   const { user } = ChatState()
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            key={i}
            style={{ marginBottom: "10px" }}
            className={m.sender._id === user._id ? "chatdiv" : "chatdiv1"}
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="1px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                marginTop: "5px",
                maxWidth: "500px",
                minWidth: "100px",
                marginLeft: `${
                  isLastMessage(messages, i, user._id) ||
                  isSameSender(messages, m, i, user._id)
                    ? ""
                    : "35px"
                }`,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat