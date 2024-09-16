"use client";

import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import React, { useEffect, useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MessageIcon from "@mui/icons-material/Message";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import LightModeIcon from "@mui/icons-material/LightMode";
import { FullConversationType } from "../Types";
import axios from "axios";
import config from "../helpers/config";
import ConversationList from "./ConversationList";

const MobileSidebar = () => {
  const [conversations, setConversations] = useState<FullConversationType[]>(
    []
  );
  const [users, setUsers] = useState<any>();
  const [user, setUser] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    toast.success("User logged out");
    router.push("/");
  };

  useEffect(() => {
    axios
      .get("/api/getCurrentUser", config)
      .then((response) => {
        setUser(response.data.data);
      })
      .catch((error) => {
        toast.error("Error fetching conversations");
      });

    axios
      .get("/api/fetchChat", config)
      .then((response) => {
        setConversations(response.data);
      })
      .catch((error) => {
        toast.error("Error fetching conversations");
        console.log("Error fetching chats: ", error);
      });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/fetchUsers", config);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="box-shadow1 m-[10px] py-[10px] px-[5px]">
      <div className={"flex justify-between dark:dark"}>
        <div>
          <IconButton onClick={() => router.push("/chatter")}>
            <AccountCircleIcon className={" dark:dark"} />
          </IconButton>
          <IconButton onClick={() => router.push("/chatter")}>
            <MessageIcon className={" dark:dark"} />
          </IconButton>
        </div>
        <div className="">
          <IconButton onClick={() => router.push("/chatter/users")}>
            <PersonAddIcon className={"dark:dark"} />
          </IconButton>
          <IconButton>
            {"dark" ? (
              <NightlightRoundIcon />
            ) : (
              <LightModeIcon className={"dark:dark"} />
            )}
          </IconButton>
          <IconButton onClick={handleLogout}>
            <ExitToAppIcon className={"dark:dark"} />
          </IconButton>
        </div>
      </div>
      {/* List of Chats */}
      <ConversationList users={users} initialItems={conversations} />
    </div>
  );
};

export default MobileSidebar;
