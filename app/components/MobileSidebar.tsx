'use client'

import { IconButton } from '@mui/material'
import { useRouter } from 'next/navigation'
import Cookies from "js-cookie";
import { toast } from 'react-hot-toast';
import React from 'react'

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MessageIcon from '@mui/icons-material/Message';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound";
import LightModeIcon from "@mui/icons-material/LightMode";


const MobileSidebar = () => {
  const router = useRouter()

  const handleLogout = () => {
    Cookies.remove('token') 
    toast.success("User logged out")
    router.push("/");
  };
  
  return (
    <div className='box-shadow1 m-[10px] py-[10px] px-[5px]'>
        <div className={"flex justify-between dark:dark"}>
            <div>
            <IconButton onClick={() => router.push("/chatter")}>
                <AccountCircleIcon className={ " dark:dark"}/>
            </IconButton>
            <IconButton onClick={() => router.push("/chatter")}>
                <MessageIcon className={ " dark:dark"}/>
            </IconButton>
            </div>
            <div className=''>
                <IconButton onClick={() => router.push("/chatter/users")}>
                    <PersonAddIcon className={"dark:dark"} />
                </IconButton>
                <IconButton >
                    {"dark" ? <NightlightRoundIcon /> : <LightModeIcon  className={"dark:dark"}/>}
                </IconButton>
                <IconButton onClick={handleLogout}>
                    <ExitToAppIcon className={"dark:dark"}/>
                </IconButton>
            </div>
      </div>
    </div>
  )
}

export default MobileSidebar