'use client'

import React, { useContext, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Dialog, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageSelf from "./MessageSelf";
import MessageOthers from "./MessageOthers";
import { useRouter, useSearchParams } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";
import axios, { all } from "axios";
import { getCookie } from "../helpers/cookieHelpers";

function Chatarea() {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [allMessages, setAllMessages] = useState<any>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loaded, setloaded] = useState(false);

  const messagesEndRef = useRef(null);
  const searchParam = useSearchParams();
  // const [chat_id, chat_user] = searchParam.get("&");
  console.log("searchParam userId: ", searchParam.get("userId"));
  // console.log(dyParams._id);
  const userData = getCookie("token")

  useEffect(() => {
    if (userData) {
      axios.post('/api/getUserData', {
        token: userData 
      })
      .then((response) => {
        const data = response.data;
        if (data.userInfo) {
          setUserInfo(data.userInfo);
        } else {
          console.log('Invalid token');
        }
      })
      .catch((error) => {
        console.error('Error verifying token:', error);
      });
    }
  }, [userData]);


  // const chat_id = '123'
  // const chat_user = '456'

  const sendMessage = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData}`,
      },
    };

    try {
      const { data } = await axios.post("/message",{ content: messageContent, chatId: chat_id, }, config);
      console.log("Sent Message ", data);
      setAllMessages([...allMessages, data]);
      setMessageContent("");
    } catch (error) {
      console.error(error);
    }
  };

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${userData}`,
  //       },
  //     };

  //     try {
  //       const { data } = await axios.get("/message" + chat_id, config);
  //       console.log("Data refreshed in Users panel ", data);
  //       const messagesWithContent = data?.map((message: any) => {
  //         return {
  //           ...message,
  //           content: message.content || "", // Set to empty string if 'content' is undefined
  //         };
  //       });
  //       setAllMessages(messagesWithContent);
  //       setloaded(true);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //     }
  //   };

  //   fetchUsers();
  // }, [userData, chat_id]);

  // const handleDeleteChat = async () => {
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${userData}`,
  //     },
  //   };

  //   try {
  //     const { data } = await axios.delete(`/chat/${encodeURIComponent(chat_id)}`, config);
  //     console.log("Deleted data and res: ", data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  if (!loaded) {
    return (
      <div
        className="h-full"
        style={{
          border: "20px",
          padding: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
    );
  } else {
    return (
      <div className={"chatarea-container dark:dark"}>
        <div className={"chatarea-header dark:dark"}>
          <p className={"con-icon dark:dark"}>
            {chat_user[0]}
          </p>
          <div className={"header-text dark:dark"}>
            <p className={"con-title dark: dark"}>
              {chat_user}
            </p>
            {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
              {props.timeStamp}
            </p> */}
          </div>
          <IconButton
            onClick={() => {
              setShowDeleteConfirmation(true);
            }}
            className={"icon dark:dark"}
          >
            <DeleteIcon />
          </IconButton>

          {/* Dialog for confirmation */}
          <Dialog
            open={showDeleteConfirmation}
            onClose={() => setShowDeleteConfirmation(false)}
          >
            <div>
              <p>Are you sure you want to delete this chat?</p>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDeleteChat}
              >
                Delete
              </Button>
            </div>
          </Dialog>
        </div>
        <div className={"message-container dark:dark"}>
          {/* {allMessages
            .slice(0)
            .reverse()
            .map((message, index) => {
              const sender = message.sender;
              const self_id = userData.data._id;
              if (sender._id === self_id) {
                return <MessageSelf props={message} key={index} />;
              } else {
                // console.log("Someone Sent it");
                return <MessageOthers props={message} key={index} />;
              }
            })} */}

          {allMessages.map((message: any, index: number) => {
            const sender = message.sender;
            const self_id = userInfo.id;
            if (sender._id === self_id) {
              return <MessageSelf message={message} key={index} />;
            } else {
              return (
                <MessageOthers
                  sender={message.sender}
                  content={message.content}
                  key={index}
                />
              );
            }
          })}
        </div>
        <div ref={messagesEndRef} className="BOTTOM" />
        <div className={"input-area dark:dark"}>
          <input
            placeholder="Type a Message"
            className={"search-box dark:dark"}
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.code === "Enter") {
                sendMessage();
                // setRefresh(!refresh);
              }
            }}
          />
          <IconButton
            className={"icon dark:dark"}
            onClick={() => {
              sendMessage();
              // setRefresh(!refresh);
            }}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default Chatarea;
