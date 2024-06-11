'use client'

import axios from "axios";
import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";

function Users() {
  const [refresh, setRefresh] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const storedData = localStorage.getItem("userData");
  const userData = storedData ? JSON.parse(storedData) : null;
  const nav = useRouter();

  useEffect(() => {
    // if (!userData) {
    //   nav.push('/');
    //   return;
    // }

    const fetchUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${userData?.data?.token}`,
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
  }, [userData?.data?.token]);

  const handleClick = async (user: any) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData?.data?.token}`,
      },
    };

    try {
      const response = await axios.post(
        "/api/accessChat",
        { userId: user?.id },
        config
      );
      console.log("chat response: ", response);
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  }

  return (
    <div className={"Users-container dark:dark"}>
      {users.map((user: any, index) => (
        <div
          className={"redbac" }
          key={index}
          onClick={() => {
            handleClick(user)
          }} 
        >
          <p className="text-black">{user?.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Users;
