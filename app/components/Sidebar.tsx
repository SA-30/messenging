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
import ConversationList from "./ConversationList";
import axios from "axios";
import { FullConversationType } from "../Types";

const Sidebar = () => {
  const [conversations, setConversations] = useState<FullConversationType[]>([]);
  const userData = getCookie("token")
  
  const router = useRouter()

  const handleLogout = () => {
    Cookies.remove('token') 
    toast.success("User logged out")
    router.push("/");
  };

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData}`,
      },
    };

    axios
      .get("/api/fetchChat", config)
      .then((response) => {
        // console.log(response.data);
        setConversations(response.data);
      })
      .catch((error) => {
        toast.error("Error fetching conversations")
        console.log("Error fetching chats: ", error);
      });
  }, [userData]);

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
        <input placeholder="Search" className="search-box w-full" />
      </div>

      {/* List of Chats */}
      <ConversationList initialItems={conversations}/>
    </div>
  );
};

export default Sidebar;
