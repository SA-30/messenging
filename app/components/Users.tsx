"use client";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { IconButton, Skeleton } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { getCookie } from "../helpers/cookieHelpers";
import Avatar from "./Avatar";

function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const userData = getCookie("token");
  const nav = useRouter();

  // Debouncing logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  useEffect(() => {
    if (!userData) {
      nav.push("/");
      return;
    }

    const fetchUsers = async () => {
      if (!debouncedKeyword.trim()) {
        setUsers([]);
        return;
      }

      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${userData}`,
        },
      };

      try {
        const { data } = await axios.get(
          `/api/getUsers?search=${debouncedKeyword}`,
          config
        );
        setUsers(data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [nav, userData, debouncedKeyword]);

  const handleClick = async (user: any) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData}`,
      },
    };

    await axios
      .post("/api/accessChat", { userId: user.id }, config)
      .then((data) => {
        nav.push(`/chatter/${data.data.id}`);
      });
  };

  const handleUsersSearch = (e: any) => {
    setKeyword(e.target.value);
  };

  return (
    <div
      className="
      dark:dark flex
      flex-col gap-[10px]
      px-3 pb-2 h-[90vh]
    "
    >
      {/* Search Bar */}
      <div
        className={"sb-search dark:text-white dark:bg-[#333333] dark:shadow-sm"}
      >
        <IconButton className="">
          <SearchIcon className="dark:text-white" />
        </IconButton>
        <input
          placeholder="Search your friends..."
          value={keyword}
          onChange={handleUsersSearch}
          className="search-box w-full dark:bg-[#333333] dark:shadow-sm"
        />
      </div>
      {loading ? (
        <div className="flex flex-col gap-[10px] p-3 h-[90vh]">
          <div className="rounded-[10px] p-5 grid sm:grid-cols-2 gap-5 box-shadow1 hide-scrollbar overflow-y-auto h-full bg-white dark:bg-[#333333]">
            {Array.from(new Array(10)).map((_, index) => (
              <div
                key={index}
                className="p-2 h-[60px] box-shadow2 rounded-[10px] flex items-center justify-between"
              >
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
      ) : users.length === 0 ? (
        <h2 className="text-center font-semibold text-lg dark:text-gray-600/80 text-gray-400">
          Empty search results
        </h2>
      ) : (
        <div className="rounded-[10px] mx-2 p-5 grid grid-cols-2 gap-5 box-shadow1 hide-scrollbar dark:bg-[#333333] dark:shadow-sm overflow-y-auto  bg-white">
          {users.map((user: any, index) => (
            <div
              className="p-2 h-[60px] dark:bg-[#222222]  box-shadow2 rounded-[10px] flex items-center justify-between"
              key={index}
            >
              <div className="flex items-center gap-2">
                <Avatar user={user} />
                <p className="text-black dark:text-[#999999]">{user?.name}</p>
              </div>
              <IconButton
                onClick={() => {
                  handleClick(user);
                }}
              >
                <PersonAddAlt1Icon className={"dark:text-[#999999]"} />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Users;
