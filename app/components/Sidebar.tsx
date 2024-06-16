'use client'

import React, { useCallback, useEffect, useState } from "react";
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
import config from "../helpers/config";
import Avatar from '@/app/components/Avatar'
import { User } from "@prisma/client";
import SettingModal from "./SettingModal";

const Sidebar = () => {
  const [conversations, setConversations] = useState<FullConversationType[]>([]);
  const [user, setUser] = useState<any>()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    Cookies.remove('token') 
    toast.success("User logged out")
    router.push("/");
  };

  useEffect(() => {
    axios
    .get("/api/getCurrentUser", config)
    .then((response) => {
      setUser(response.data.data)
    })
    .catch((error) => {
      toast.error("Error fetching conversations")
    });

    axios
      .get("/api/fetchChat", config)
      .then((response) => {
        setConversations(response.data);
      })
      .catch((error) => {
        toast.error("Error fetching conversations")
        console.log("Error fetching chats: ", error);
      });
  }, []);

  return (
    <>
      <SettingModal
        currentUser={user}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className="">
        {/* Header */}
        <div className={"sb-header dark:dark"}>
          <div>
            <IconButton onClick={() => setIsOpen(true)}>
              <Avatar size="profile" user={user}/>
              {/* <AccountCircleIcon className={ " dark:dark"}/> */}
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
            <IconButton>
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
    </>
  );
};

export default Sidebar;
