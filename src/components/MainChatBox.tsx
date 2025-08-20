import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import userAuth from "../store/userAuth";
import moment from "moment";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BsFillChatLeftDotsFill } from "react-icons/bs";

type MainChatBoxProps = {
  conversationId: string;
  messages: {
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
  allConversation: {
    _id: string;
    participants: string[];
    lastMessage: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }[];
  allUser: {
    _id: string;
    email: string;
    username: string;
    role: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }[];
  setText: React.Dispatch<React.SetStateAction<string>>;
  text: string;
  sendMessage: () => void;
  handleTyping: (textValue: string) => void;
  onlineUser: string[];
  eachUser: {
    id: string;
    username: string;
    image: string;
  };
  typingInfo: {
    isTypying: boolean;
    userName: string;
    conversationId: string;
  };
  setEditText: React.Dispatch<
    React.SetStateAction<{
      messageId: string;
      conversationId: string;
      newText: string;
      senderId: string;
    }>
  >;
  editText: {
    messageId: string;
    conversationId: string;
    newText: string;
    senderId: string;
  };
  setDeleteMessage: React.Dispatch<
    React.SetStateAction<{
      messageId: string;
      conversationId: string;
      senderId: string;
    }>
  >;
  sendEditedmMessage: () => void;
  DeleteMessageInfo: () => void;
  handleEditTyping: (textValue: string) => void;
  setSmallScreen: React.Dispatch<
    React.SetStateAction<{
      showSidebar: boolean;
      showMainChat: boolean;
    }>
  >;
};
const MainChatBox = ({
  conversationId,
  messages,
  setText,
  text,
  sendMessage,
  handleTyping,
  onlineUser,
  eachUser,
  typingInfo,
  setEditText,
  editText,
  sendEditedmMessage,
  handleEditTyping,
  DeleteMessageInfo,
  setDeleteMessage,
  setSmallScreen,
}: MainChatBoxProps) => {
  const { userDetails } = userAuth();
  const [editable, setEditable] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const formatDateTime = (Date: Date) => {
    if (moment(Date).isSame(moment(), "day")) {
      return moment(Date).format("hh:mm A");
    } else if (moment(Date).isSame(moment().subtract(1, "day"), "day")) {
      return "Yesterday";
    } else {
      return moment(Date).format("MMM DD YYYY hh:mm A");
    }
  };
  const handleKeyEnter = () => {
    sendEditedmMessage();
    setEditable(false);
  };
  return (
    <div className="w-full bg-gray-50 border border-gray-100 rounded-lg">
      {conversationId ? (
        <>
          <div className="flex flex-col gap-5 md:px-3 px-2 justify-between w-full h-[100dvh]">
            <div className="flex flex-row flex-shrink-0 rounded-tl-xl rounded-tr-xl justify-between w-full items-center md:px-5 py-4 bg-white">
              <div className="flex flex-row gap-4 items-center">
                <Image
                  src={eachUser.image}
                  alt={eachUser.username}
                  width={50}
                  height={50}
                  className="w-max h-max p-1 rounded-full"
                />

                <div className="flex flex-col justify-start">
                  <h1 className="text-sm font-semibold text-black">
                    {eachUser.username.charAt(0).toUpperCase() +
                      eachUser.username.slice(1)}
                  </h1>
                  {typingInfo.conversationId === conversationId &&
                  typingInfo.isTypying &&
                  typingInfo.userName !== userDetails?.role ? (
                    <p className="text-[0.7rem] text-green-500">
                      {`${typingInfo.userName} is typing `}
                    </p>
                  ) : (
                    <p
                      className={`text-[0.7rem] ${
                        onlineUser.includes(eachUser.id)
                          ? "text-green-500"
                          : "text-black"
                      }`}
                    >
                      {`${eachUser.username} is ${
                        onlineUser.includes(eachUser.id) ? "online" : "offline"
                      } `}
                    </p>
                  )}
                </div>
              </div>
              <div className="md:hidden block">
                <BsFillChatLeftDotsFill
                  onClick={() =>
                    setSmallScreen((prevData) => {
                      return {
                        ...prevData,
                        showMainChat: false,
                        showSidebar: true,
                      };
                    })
                  }
                />
              </div>
            </div>

            <div className="h-full flex flex-col flex-1 px-1 md:px-5 w-full overflow-y-auto no-scrollbar">
              {messages.map((eachMessage, index) => {
                const prevMessage = messages[index - 1];
                const gap =
                  prevMessage && prevMessage.senderId === eachMessage.senderId
                    ? "mt-1"
                    : "mt-5";
                return (
                  <div
                    key={index}
                    className={`w-full ${gap} flex items-center flex-row ${
                      eachMessage.senderId === userDetails!._id
                        ? "justify-end"
                        : "justify-start"
                    } `}
                    ref={index === messages.length - 1 ? lastMessageRef : null}
                  >
                    <div
                      className={`max-w-[70%] px-3 md:min-w-[20%] min-w-[15%] flex flex-col py-1 w-fit rounded-md ${
                        eachMessage.senderId === userDetails!._id
                          ? "bg-green-100 shadow-sm"
                          : "bg-white border-gray-100 border-2"
                      } `}
                    >
                      {eachMessage.deleted ? (
                        <p className="text-sm cursor-not-allowed italic">
                          This message was deleted
                        </p>
                      ) : (
                        <>
                          <p className="text-sm">{eachMessage.text}</p>
                          <div className="flex flex-row justify-end text-end items-center gap-3">
                            {eachMessage.edited && (
                              <p className="text-[0.6rem] italic">Edited</p>
                            )}

                            <p className="text-[0.6rem] justify-end text-end">
                              {formatDateTime(eachMessage.createdAt)}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    {eachMessage.senderId === userDetails!._id && (
                      <>
                        {eachMessage.deleted === true ? (
                          <HiOutlineDotsVertical className="text-black/40 cursor-not-allowed" />
                        ) : (
                          <Dropdown className="">
                            <DropdownTrigger>
                              <HiOutlineDotsVertical
                                onClick={() => {
                                  setEditText((prevData) => {
                                    return {
                                      ...prevData,
                                      conversationId:
                                        eachMessage.conversationId,
                                      messageId: eachMessage._id,
                                      senderId: eachMessage.senderId,
                                      newText: eachMessage.text,
                                    };
                                  });
                                  setDeleteMessage((prevData) => {
                                    return {
                                      ...prevData,
                                      conversationId:
                                        eachMessage.conversationId,
                                      messageId: eachMessage._id,
                                      senderId: eachMessage.senderId,
                                    };
                                  });
                                }}
                                className="text-black/40 cursor-pointer"
                              />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                              <DropdownItem
                                onClick={() => setEditable(true)}
                                key="edit"
                              >
                                Edit Message
                              </DropdownItem>
                              <DropdownItem
                                onPress={() => DeleteMessageInfo()}
                                color="danger"
                                key="delete"
                              >
                                Delete Message
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
              <div ref={lastMessageRef} />
            </div>

            <div className="md:p-5 p-1 sticky bottom-0 flex flex-shrink-0">
              <Input
                className="border border-gray-100 w-full"
                variant="bordered"
                label="Type a message"
                endContent={
                  <IoSend
                    size={24}
                    onClick={() => {
                      sendMessage();
                    }}
                    className="cursor-pointer"
                  />
                }
                value={text}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setText(e.target.value);
                  handleTyping(e.target.value);
                }}
                onKeyDown={(e: React.KeyboardEvent) =>
                  e.key === "Enter" && sendMessage()
                }
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full h-screen flex flex-col justify-center items-center">
            <div>
              <h1 className="text-sm font-semibold">No Message to display</h1>
              <p className="text-[0.7rem]">Kindly select who to chat with </p>
            </div>
          </div>
        </>
      )}
      <Modal isOpen={editable} onClose={() => setEditable(false)}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Edit Message
          </ModalHeader>
          <ModalBody>
            <div className="p-5">
              <Input
                className="border border-gray-100 w-full"
                variant="bordered"
                label="Enter new message"
                value={editText.newText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEditText((prevData) => {
                    return {
                      ...prevData,
                      newText: e.target.value,
                    };
                  });
                  handleEditTyping(e.target.value);
                }}
                onKeyDown={(e: React.KeyboardEvent) =>
                  e.key === "Enter" && handleKeyEnter()
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setEditable(false)}
            >
              Close
            </Button>
            <Button
              color="primary"
              size="md"
              className="bg-teal-700 text-white"
              onPress={() => {
                sendEditedmMessage();
                setEditable(false);
              }}
            >
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MainChatBox;
