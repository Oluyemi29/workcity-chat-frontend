import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { IoSearchSharp } from "react-icons/io5";
import userAuth from "../store/userAuth";
import { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { BackendURL } from "../hooks/apiLinks";
import { GoDotFill } from "react-icons/go";

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
type allConversationProps = {
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
  setConversationId: React.Dispatch<React.SetStateAction<string>>;
  typingInfo: {
    isTypying: boolean;
    userName: string;
    conversationId: string;
  };
  setEachUser: React.Dispatch<
    React.SetStateAction<{
      id: string;
      username: string;
      image: string;
    }>
  >;
  eachUser: {
    id: string;
    username: string;
    image: string;
  };
  setSmallScreen: React.Dispatch<
    React.SetStateAction<{
      showSidebar: boolean;
      showMainChat: boolean;
    }>
  >;
  onlineUser: string[];
};

const SideBar = ({
  onlineUser,
  allConversation,
  allUser,
  setConversationId,
  typingInfo,
  setEachUser,
  eachUser,
  setSmallScreen,
}: allConversationProps) => {
  const navigate = useNavigate();
  const { userDetails, Logout } = userAuth();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchInput, setSearchinput] = useState("");
  const [filteredUser, setFilteredUser] = useState<allUserProps>(allUser);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [chatCategory, setChatCategory] = useState("chats");
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    setFilteredUser(allUser);
  }, [allUser]);
  const Name = userDetails?.username.includes(" ")
    ? userDetails.username.split(" ")[0]
    : userDetails?.username;

  const handleLogout = async () => {
    Logout();
    onClose();
    return navigate("/login");
  };

  const handleConversationId = async (userId: string) => {
    const Both = [userId, userDetails!._id];
    const ExistConversation = allConversation.find((eachConversation) => {
      return eachConversation.participants.every((Allparti) =>
        Both.includes(Allparti)
      );
    });
    if (ExistConversation) {
      return setConversationId(ExistConversation._id);
    } else {
      const Apilink = BackendURL();
      const request = await fetch(`${Apilink}/api/createconversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          senderId: userDetails!._id,
          receiverId: userId,
        }),
      });
      const response = await request.json();
      if (response.success) {
        setConversationId(response.data._id);
      }
    }
  };
  const MyConvers = filteredUser.filter((eachUser) => {
    return allConversation.some((eachConvers) =>
      eachConvers.participants.includes(eachUser._id)
    );
  });

  const handleSearch = (value: string) => {
    const result = allUser.filter(
      (eachData) =>
        eachData.username.toLowerCase().includes(value.toLowerCase()) ||
        eachData.email.toLowerCase().includes(value.toLowerCase()) ||
        eachData.role.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUser(result);
  };
  return (
    <div className="w-full rounded-xl flex flex-col relative bg-white h-screen">
      <div className="flex flex-row justify-between rounded-xl w-full items-center px-4 py-2 bg-white">
        <div
          onClick={() => setDrawer(true)}
          className="flex flex-row gap-4 items-center cursor-pointer"
        >
          <Image
            src={userDetails?.image as string}
            alt={Name}
            width={30}
            height={30}
            className="rounded-full"
          />
          <div className="flex flex-col justify-start">
            <h1 className="text-sm font-semibold text-black">
              {Name ? Name.charAt(0).toUpperCase() + Name.slice(1) : Name}
            </h1>
            {<p className="text-[0.8rem] text-black/60">Account info</p>}
          </div>
        </div>
        <div>
          <IoSearchSharp
            className="cursor-pointer"
            onClick={() => setShowSearchBar(true)}
          />
        </div>
      </div>

      <div className="p-4">
        <Divider orientation="horizontal" />
      </div>
      {/* search icon */}
      {showSearchBar && (
        <div className="py-2 px-5">
          <Input
            className="w-full"
            variant="bordered"
            placeholder="Search"
            endContent={
              <FaXmark
                size={18}
                onClick={() => {
                  setShowSearchBar(false);
                }}
                className="cursor-pointer"
              />
            }
            value={searchInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleSearch(e.target.value);
              setSearchinput(e.target.value);
            }}
          />
        </div>
      )}

      {/* chat chatCategory */}
      <div className="flex w-full my-3 flex-row px-3 justify-around gap-3 items-center">
        <p
          onClick={() => setChatCategory("chats")}
          className={`text-sm cursor-pointer ${
            chatCategory === "chats"
              ? "bg-gray-100 font-semibold"
              : "bg-gray-50"
          } w-full text-center py-2 rounded-md`}
        >
          Chats
        </p>
        <p
          onClick={() => setChatCategory("conversations")}
          className={`text-sm cursor-pointer ${
            chatCategory === "conversations"
              ? "bg-gray-100 font-semibold"
              : "bg-gray-50"
          } w-full text-center py-2 rounded-md`}
        >
          Conversation
        </p>
      </div>
      <div className="flex flex-col h-full mb-14 overflow-y-auto no-scrollbar">
        <div className="px-3 py-1 flex flex-col gap-5">
          {/* chatCategory detail */}
          {chatCategory === "chats" ? (
            <>
              {filteredUser.length < 1 ? (
                <>
                  <div className="flex flex-row justify-center mt-20">
                    <p className="text-sm font-semibold">You have no Chats</p>
                  </div>
                </>
              ) : (
                <>
                  {filteredUser.map((eachUser, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-row justify-between rounded-md w-full items-center py-2 px-2 cursor-pointer bg-white hover:bg-gray-100"
                        onClick={() => {
                          handleConversationId(eachUser._id);
                          setEachUser((prevData) => {
                            return {
                              ...prevData,
                              id: eachUser._id,
                              username: eachUser.username,
                              image: eachUser.image,
                            };
                          });
                          setSmallScreen((prevData) => {
                            return {
                              ...prevData,
                              showSidebar: false,
                              showMainChat: true,
                            };
                          });
                        }}
                      >
                        <div className="flex flex-row gap-4 items-center w-[75%]">
                          <Image
                            src={eachUser.image as string}
                            alt={eachUser.role}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                          <div className="flex flex-col justify-start">
                            <h1 className="text-sm font-semibold text-black line-clamp-1">
                              {eachUser.username.charAt(0).toUpperCase() +
                                eachUser.username.slice(1)}
                            </h1>
                            <p className="text-[0.7rem] line-clamp-1">
                              {
                                // typingInfo.isTypying &&
                                // eachUser.role === typingInfo.userName &&
                                // allConversation.find(
                                //   (eachConvers) =>
                                //     eachConvers._id === typingInfo.conversationId
                                // )
                                allConversation.find(
                                  (eachConvers) =>
                                    eachConvers.participants.includes(
                                      eachUser._id
                                    ) &&
                                    eachConvers.participants.includes(
                                      userDetails!._id
                                    )
                                )?._id === typingInfo.conversationId &&
                                typingInfo.isTypying &&
                                typingInfo.userName === eachUser.role
                                  ? ` ${typingInfo.userName} is  typing`
                                  : allConversation.find((eachConversation) => {
                                      return (
                                        eachConversation.participants.includes(
                                          eachUser._id
                                        ) &&
                                        eachConversation.participants.includes(
                                          userDetails!._id
                                        )
                                      );
                                    })?.lastMessage ||
                                    `No chat with ${eachUser.role} yet`
                              }
                            </p>
                          </div>
                        </div>
                        <div className="w-[25%] flex flex-row justify-end">
                          <div>
                            {onlineUser.includes(eachUser._id) ? (
                              <div className="flex flex-col justify-center items-center">
                                <GoDotFill
                                  className="text-green-600"
                                  size={18}
                                />
                                <p className="text-green-600 text-[0.7rem]">
                                  online
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col justify-center items-center">
                                <GoDotFill
                                  className="text-gray-600"
                                  size={18}
                                />
                                <p className="text-[0.7rem] text-gray-600">
                                  offline
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          ) : (
            <>
              {MyConvers.length < 1 ? (
                <>
                  <div className="flex flex-row justify-center mt-20">
                    <p className="text-sm font-semibold">
                      You have no Conversation
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {MyConvers.map((eachUser, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-row justify-between rounded-md w-full items-center py-2 px-2 cursor-pointer bg-white hover:bg-gray-100"
                        onClick={() => {
                          handleConversationId(eachUser._id);
                          setEachUser((prevData) => {
                            return {
                              ...prevData,
                              id: eachUser._id,
                              username: eachUser.username,
                              image: eachUser.image,
                            };
                          });
                          setSmallScreen((prevData) => {
                            return {
                              ...prevData,
                              showSidebar: false,
                              showMainChat: true,
                            };
                          });
                        }}
                      >
                        <div className="flex flex-row gap-4 items-center w-[75%]">
                          <Image
                            src={eachUser.image as string}
                            alt={eachUser.role}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                          <div className="flex flex-col justify-start">
                            <h1 className="text-sm font-semibold text-black line-clamp-1">
                              {eachUser.username.charAt(0).toUpperCase() +
                                eachUser.username.slice(1)}
                            </h1>
                            <p className="text-[0.7rem]  line-clamp-1">
                              {typingInfo.isTypying &&
                              eachUser.role === typingInfo.userName
                                ? ` ${typingInfo.userName} is  ${typingInfo.userName}`
                                : allConversation.find((eachConversation) => {
                                    return eachConversation.participants.includes(
                                      eachUser._id
                                    );
                                  })?.lastMessage ||
                                  `No chat with ${eachUser.role} yet`}
                            </p>
                          </div>
                        </div>
                        <div className="w-[25%] flex flex-row justify-end">
                          <div>
                            <div>
                              {onlineUser.includes(eachUser._id) ? (
                                <GoDotFill
                                  className="text-green-600"
                                  size={18}
                                />
                              ) : (
                                <GoDotFill
                                  className="text-gray-600"
                                  size={18}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
      </div>
      {/* logout */}
      <div className="absolute bottom-5 w-full flex flex-row justify-end px-5">
        <LuLogOut onClick={onOpen} color="red" className="cursor-pointer" />
      </div>
      <Modal onClose={onClose} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Log Out</ModalHeader>
          <ModalBody>
            <p>Are you sure that you want to logout?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              color="primary"
              className="bg-red-700 text-white"
              onPress={() => handleLogout()}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Drawer isOpen={drawer} size={"md"} onClose={() => setDrawer(false)}>
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1">
            Profile details
          </DrawerHeader>
          <DrawerBody className="flex flex-col w-full justify-center items-center">
            <Image
              src={userDetails!.image}
              alt={eachUser.username}
              width={100}
              height={100}
              className="rounded-full border-2 border-gray-300"
            />
            <div className="flex flex-row gap-4 font-semibold">
              <p>Role :</p>
              <p>{userDetails!.role}</p>
            </div>
            <div className="flex flex-row gap-4 font-semibold">
              <p>Username :</p>
              <p>{userDetails!.username}</p>
            </div>
            <div className="flex flex-row gap-4 font-semibold">
              <p>Email :</p>
              <p>{userDetails!.email}</p>
            </div>
          </DrawerBody>
          <DrawerFooter className="flex w-full flex-row justify-between">
            <Button
              color="danger"
              className="bg-red-500 text-white"
              onPress={() => {
                setDrawer(false);
                onOpenChange();
              }}
            >
              Logout
            </Button>
            <Button
              color="danger"
              variant="light"
              onPress={() => setDrawer(false)}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideBar;
