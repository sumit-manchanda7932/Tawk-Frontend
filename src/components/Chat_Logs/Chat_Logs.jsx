import React, { useState, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../Loader/Loader";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "../Modal/GroupChatModal/GroupChatModal";
import styles from "./Chat_Logs.module.css";
import Avatar from "../Avatar/Avatar";

const Chat_Logs = ({ fetchAgain, className }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats, setIsAIChat } =
    ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/chats`, config);
      setChats(data);
    } catch (err) {
      toast.error(err);
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("User")));
    fetchChats();
  }, [fetchAgain]);

 

  if (!loggedUser) {
    return <Loader />;
  }
  return (
    <div className={styles.sidebar + " " + className}>
      <div className={styles.chatsHeader}>
        <h2>My Chats</h2>
        <GroupChatModal>
          <button className={styles.button}>Create Group</button>
        </GroupChatModal>
      </div>
      <div className={styles.chatsContainer}>
        {chats ? (
          <div className={styles.chats}>
            {chats.map((chat, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedChat(chat);
           
                }}
                className={
                  (selectedChat?._id === chat._id ? styles.active : "") +
                  " " +
                  styles.chat
                }
              >
                <Avatar
                  className={styles.avatar}
                  isGroupChat={chat.isGroupChat}
                  size={40}
                  name={getSender(loggedUser.user, chat.users)?.name}
                  image={getSender(loggedUser.user, chat.users)?.image}
                />
                <div className={styles.chatName}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser?.user, chat?.users)?.name
                    : chat.chatName}
                  { 
                    <span>
                      {chat.isGroupChat &&
                      chat.latestMessage?.sender?.name &&
                      chat.latestMessage?.content ? (
                        chat.latestMessage.sender.name ===
                        loggedUser.user?.name ? (
                          <b>You:</b>
                        ) : (
                          <b>{chat.latestMessage.sender.name}:</b>
                        )
                      ) : null}{" "}
                      {chat.latestMessage?.content?.length > 30
                        ? chat.latestMessage.content.substring(0, 31) + "..."
                        : chat.latestMessage?.content}
                    </span>
                  }
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default Chat_Logs;
