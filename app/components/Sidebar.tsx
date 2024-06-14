'use client'

import React, { useEffect, useState } from "react";
import "../globals.css";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchIcon from "@mui/icons-material/Search";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { getCookie } from "../helpers/cookieHelpers";
import { toast } from 'react-hot-toast';

const Sidebar = () => {
  const [conversations, setConversations] = useState([]);
  const userData = getCookie("token")
  
  const router = useRouter()

  const handleLogout = () => {
    // localStorage.removeItem("userData");
    Cookies.remove('token') 
    toast.success("User logged out")
    router.push("/");
  };

  // useEffect(() => {
  //   // if (!userData) {
  //   //   router.push("/");
  //   //   return;
  //   // }

  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${userData}`,
  //     },
  //   };

  //   axios
  //     .get("/api/fetchChat", config)
  //     .then((response) => {
  //       console.log("response " ,response);
  //       setConversations(response.data);
  //     })
  //     .catch((error) => {
  //       console.log("Error fetching chats: ", error);
  //     });
  // }, [userData]);

  // const renderChatName = (conversation: any) => {
  //   if (conversation.isGroupChat) {
  //     return conversation.chatName;
  //   } else {
  //     const otherUser = conversation.users.find(
  //       (user: any) => user._id !== userData.data._id
  //     );
  //     return otherUser ? otherUser.name : "Unknown User";
  //   }
  // };

  return (
    <div className="sidebar-container">
      {/* Header */}
      <div className={"sb-header dark:dark"}>
        <div>
          <IconButton onClick={() => router.push("/chatter")}>
            <AccountCircleIcon className={ " dark:dark"}/>
          </IconButton>
          <IconButton onClick={handleLogout}>
            <ExitToAppIcon className={"dark:dark"}/>
          </IconButton>
        </div>
        <div >
          <IconButton onClick={() => router.push("/chatter/users")}>
            <PersonAddIcon className={"dark:dark"} />
          </IconButton>
          {/* <IconButton onClick={() => navigate("create-groups")}>
            <AddCircleIcon />
          </IconButton> */}
          <IconButton >
            {"dark" ? <NightlightRoundIcon /> : <LightModeIcon  className={"dark:dark"}/>}
          </IconButton>
        </div>
      </div>

      {/* Search Bar */}
      <div className={"sb-search dark:dark"}>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <input placeholder="Search" className="search-box" />
      </div>

      {/* List of Chats */}
      {/* <div className={"sb-users dark:dark"}>
        {conversations.map((conversation: any, index) => (
          <div
            key={index}
            onClick={() =>
              router.push(
                "/chatter/chat/" + conversation._id + "&" + renderChatName(conversation)
              )
            }
          >
            <div  className={"conversation-container white dark:black"} >
              <p className="con-icon">{renderChatName(conversation)[0]}</p>
              <p className="con-title">{renderChatName(conversation)}</p>
              <p className="con-lastmessage">{renderChatName(conversation)}</p>
              <p className="con-timestamp">{renderChatName(conversation)}</p>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Sidebar;
