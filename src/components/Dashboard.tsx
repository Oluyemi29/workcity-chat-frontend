import { useEffect, useState } from "react";
import MainChatBox from "./MainChatBox";
import SideBar from "./SideBar";
import userAuth from "../store/userAuth";
import { BackendURL } from "../hooks/apiLinks";
import io, { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";

type allConversationProps = {
  _id: string;
  participants: string[];
  lastMessage: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}[];
type allUserProps = {
  _id: string;
  email: string;
  username: string;
  role: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}[];
type allMessageProps = {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  edited: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}[];
type TypingProps = {
  isTypying: boolean;
  userName: string;
  conversationId: string;
};

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
const Dashboard = () => {
  const { userToken, userDetails } = userAuth();
  const [smallScreen, setSmallScreen] = useState({
    showSidebar: true,
    showMainChat: false,
  });
  const [allConversation, setAllConversation] = useState<
    allConversationProps | []
  >([]);
  const [allUser, setAllUser] = useState<allUserProps>([]);
  const [conversationId, setConversationId] = useState("");
  const [eachUser, setEachUser] = useState({
    id: "",
    username: "",
    image: "",
  });
  const [messages, setMessages] = useState<allMessageProps>([]);
  const [onlineUser, setOnlineUser] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [typingInfo, setTypingInfo] = useState<TypingProps>({
    isTypying: false,
    userName: "",
    conversationId: "",
  });
  const [editText, setEditText] = useState({
    messageId: "",
    conversationId: "",
    newText: "",
    senderId: "",
  });
  const [deleteMessage, setDeleteMessage] = useState({
    messageId: "",
    conversationId: "",
    senderId: "",
  });

  useEffect(() => {
    const getConverAftereachMess = async () => {
      const Apilink = BackendURL();
      const requestConversation = await fetch(
        `${Apilink}/api/allconversation`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const responseConversation = await requestConversation.json();
      if (responseConversation.success) {
        setAllConversation(responseConversation.data);
      }
    };
    getConverAftereachMess();
  }, [messages]);

  useEffect(() => {
    const getAllConveration = async () => {
      const Apilink = BackendURL();
      socket = io(`${Apilink}`);
      socket.emit("addUser", userDetails!._id);
      socket.on("getOnlineUsers", (onlineUser) => {
        setOnlineUser(onlineUser);
      });
      const requestConversation = await fetch(
        `${Apilink}/api/allconversation`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const requestUser = await fetch(
        `${Apilink}/api/alluser/${userDetails!.role}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const responseConversation = await requestConversation.json();
      const responseUser = await requestUser.json();
      if (responseConversation.success) {
        setAllConversation(responseConversation.data);
      }
      if (responseUser.success) {
        setAllUser(responseUser.data);
      }

      if (conversationId) {
        const requestMessage = await fetch(
          `${Apilink}/api/messages/${conversationId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const responseMessage = await requestMessage.json();
        if (responseMessage.success) {
          setMessages(responseMessage.data);
        }
        socket.emit("joinConversation", conversationId);
        socket.on("newMessage", (msg) => {
          setMessages((prevData) => {
            return [...prevData, msg];
          });
        });

        socket.on("messageEdited", (updateMessage) => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg._id === updateMessage._id ? updateMessage : msg
            )
          );
        });
        socket.on("messageDeleted", (deleteMessage) => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg._id === deleteMessage._id ? deleteMessage : msg
            )
          );
        });

        socket.on("typing", ({ isTyping, userName, conversationId }) => {
          setTypingInfo((prevData) => {
            return {
              ...prevData,
              isTypying: isTyping,
              userName: userName,
              conversationId: conversationId,
            };
          });
        });
      }
    };

    getAllConveration();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userToken, userDetails, conversationId]);

  const sendMessage = () => {
    if (!conversationId) {
      return;
    }
    if (text.trim() === "") {
      return;
    }
    socket.emit("sendMessage", {
      conversationId,
      senderId: userDetails!._id,
      text,
    });
    setText("");
    socket.emit("typing", {
      isTyping: false,
      conversationId: conversationId,
      userName: userDetails!.role,
    });
    setAllConversation((prevData) => {
      prevData.map((eachConvers) => {
        if (eachConvers._id === conversationId) {
          eachConvers.lastMessage = text;
        }
      });
      return prevData;
    });
  };
  const handleTyping = (textValue: string) => {
    if (textValue.trim()) {
      socket.emit("typing", {
        isTyping: true,
        conversationId: conversationId,
        userName: userDetails!.role,
      });
      setTypingInfo((prevData) => {
        return {
          ...prevData,
          isTypying: true,
          conversationId: conversationId,
          userName: userDetails!.role,
        };
      });
    } else {
      socket.emit("typing", {
        isTyping: false,
        conversationId: conversationId,
        userName: userDetails!.role,
      });
      setTypingInfo((prevData) => {
        return {
          ...prevData,
          isTypying: false,
          conversationId: conversationId,
          userName: userDetails!.role,
        };
      });
    }
  };

  const handleEditTyping = (textValue: string) => {
    if (textValue.trim()) {
      socket.emit("typing", {
        isTyping: true,
        conversationId: editText.conversationId,
        userName: userDetails!.role,
      });
      setTypingInfo((prevData) => {
        return {
          ...prevData,
          isTypying: true,
          conversationId: editText.conversationId,
          userName: userDetails!.role,
        };
      });
    } else {
      socket.emit("typing", {
        isTyping: false,
        conversationId: editText.conversationId,
        userName: userDetails!.role,
      });
      setTypingInfo((prevData) => {
        return {
          ...prevData,
          isTypying: false,
          conversationId: editText.conversationId,
          userName: userDetails!.role,
        };
      });
    }
  };

  const sendEditedmMessage = () => {
    const { conversationId, messageId, newText, senderId } = editText;
    if (
      !conversationId ||
      !messageId ||
      !newText ||
      !senderId ||
      !newText.trim()
    ) {
      return;
    }
    socket.emit("editMessage", {
      conversationId,
      messageId,
      newText,
      senderId,
    });
  };
  const DeleteMessageInfo = () => {
    const { conversationId, messageId, senderId } = deleteMessage;
    if (!conversationId || !messageId || senderId !== userDetails!._id) {
      return;
    }
    socket.emit("deleteMessage", {
      conversationId,
      messageId,
      senderId,
    });
  };

  return (

      <div className="flex flex-row gap-3 w-full p-3 bg-gray-50/75">
        <div
          className={`md:w-1/4 w-full md:block ${
            smallScreen.showSidebar ? "block" : "hidden"
          }`}
        >
          <SideBar
            allConversation={allConversation}
            allUser={allUser}
            setConversationId={setConversationId}
            typingInfo={typingInfo}
            setEachUser={setEachUser}
            eachUser={eachUser}
            setSmallScreen={setSmallScreen}
            onlineUser={onlineUser}
          />
        </div>
        <div
          className={`md:w-3/4 w-full md:block ${
            smallScreen.showMainChat ? "block" : "hidden"
          } `}
        >
          <MainChatBox
            conversationId={conversationId}
            messages={messages}
            setText={setText}
            text={text}
            sendMessage={sendMessage}
            handleTyping={handleTyping}
            onlineUser={onlineUser}
            allUser={allUser}
            allConversation={allConversation}
            eachUser={eachUser}
            typingInfo={typingInfo}
            setEditText={setEditText}
            editText={editText}
            sendEditedmMessage={sendEditedmMessage}
            handleEditTyping={handleEditTyping}
            setDeleteMessage={setDeleteMessage}
            DeleteMessageInfo={DeleteMessageInfo}
            setSmallScreen={setSmallScreen}
          />
        </div>
      </div>
  );
};

export default Dashboard;
