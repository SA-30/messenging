'use client'

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { IconButton, Skeleton } from "@mui/material";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useRouter } from "next/navigation";
import { getCookie } from "../helpers/cookieHelpers";
import Avatar from "./Avatar";

function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false)
  const userData = getCookie("token")
  const nav = useRouter();

  useEffect(() => {
    if (!userData) {
      nav.push('/');
      return;
    }

    const fetchUsers = async () => {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${userData}`,
        },
      };

      try {
        const { data } = await axios.get("/api/fetchUsers", config);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchUsers();
  }, [userData, nav]);

  const handleClick = async (user: any) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData}`,
      },
    };

    await axios.post("/api/accessChat",
      { userId: user.id }, 
      config 
    )
    .then((data) => {
      nav.push(`/chatter/${data.data.id}`)
    })
  }

  if (loading) {
    return (
      <div className="dark:dark flex flex-col gap-[10px] p-3 h-[90vh]">
        <div className="rounded-[10px] p-5 grid sm:grid-cols-2 gap-5 box-shadow1 hide-scrollbar overflow-y-auto h-full bg-white">
          {Array.from(new Array(10)).map((_, index) => (
            <div key={index} className="p-2 h-[60px] box-shadow2 rounded-[10px] flex items-center justify-between">
              <div className="flex relative w-full items-center gap-2">
                <Skeleton variant="circular" width={55} height={40} />
                <Skeleton 
                  variant="text" 
                  className="w-full mr-10" 
                  height={40}
                />
              </div>
              <Skeleton variant="circular" width={35} height={30} />
            </div>
          ))}
        </div>
      </div>
    );
  }
   
  return (
    <div 
      className="
      dark:dark flex 
      flex-col gap-[10px] 
      p-3 h-[90vh]
    ">
      <div className="rounded-[10px] p-5 grid grid-cols-2 gap-5 box-shadow1 hide-scrollbar overflow-y-auto h-full bg-white">
        {users.map((user: any, index) => (
          <div
            className="p-2 h-[60px] box-shadow2 rounded-[10px] flex items-center justify-between"
            key={index}
          >
            <div className="flex items-center gap-2">
              <Avatar user={user}/>
              <p className="text-black">{user?.name}</p>
            </div>
            <IconButton onClick={() => {handleClick(user)}}>
              <PersonAddAlt1Icon className={"dark:dark"}/>
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;
