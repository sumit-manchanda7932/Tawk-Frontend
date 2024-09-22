import React from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../../config/ChatLogics";
import { ChatState } from "../../../context/ChatProvider";
import Avatar from "../../Avatar/Avatar";
import styles from "./ChatMessages.module.css";

const ChatMessages = ({ messages }) => {
  const { user } = ChatState();
  const bottomRef = React.useRef(null);

  const scrollFeedRef = React.useCallback((node) => {
    if (node !== null) {
      node.scrollTop = node.scrollHeight;
    }
  }, []);

  React.useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div ref={scrollFeedRef} className={styles.scrollableFeed}>
      {messages &&
        messages.map((message, index) => (
          <div
            ref={index === messages.length - 1 ? bottomRef : null}
            className={styles.messageContainer}
            key={index}
          >
            {isSameSender(messages, message, index, user.user._id) ||
            isLastMessage(messages, index, user.user._id) ? (
              <Avatar
                className={styles.avatar}
                size={25}
                name={message.sender.name}
                image={message.sender.image}
              />
            ) : (
              <div style={{ width: 3 }} />
            )}

            <div
              className={`${styles.messageContent} ${
                message.sender._id === user.user._id
                  ? styles.senderMessage
                  : styles.receiverMessage
              }`}
              style={{
                marginLeft: isSameSenderMargin(
                  messages,
                  message,
                  index,
                  user.user._id
                ),
                marginTop: isSameUser(messages, message, index, user.user._id)
                  ? 3
                  : 10,
              }}
            >
              {message.content}
              <span className={styles.timeStamp}>12:34 PM</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ChatMessages;
