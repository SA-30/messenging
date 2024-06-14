'use client'

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useRouter } from "next/navigation";
import { getCookie } from "../helpers/cookieHelpers";

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

    // try {
    //   const response = await axios.post(
    //     "/api/accessChat",
    //     { userId: user.id },
    //     config
    //   );
    // } catch (error) {
    //   console.error("Error making POST request:", error);
    // }

    await axios.post("/api/accessChat",
      { userId: user.id }, 
      config 
    )
    .then((data) => {
      // console.log("data id ", data.data.id);
      // console.log("user.id ", user.id);
      
      nav.push(`/chatter/chat?userId=${data.data.id}`)
    })
  }


  return (
    <div className={"Users-container dark:dark"}>
      {users.map((user: any, index) => (
        <div
          className="redbac flex items-center justify-between"
          key={index}
        >
          <p className="text-black">{user?.name}</p>
          <IconButton onClick={() => {handleClick(user)}}>
            <PersonAddAlt1Icon className={"dark:dark"}/>
          </IconButton>
        </div>
      ))}
    </div>
  );
}

export default Users;
