"use client";

import { getCookie } from "@/app/helpers/cookieHelpers";
import useTokenExpireCheck from "@/app/hooks/useTokenExpireCheck";
import { useRouter } from "next/navigation";
import React from "react";

const Dashboard = () => {
  const router = useRouter();

  // const token = getCookie("token");
  // if (!token) router.push("/");

  // check for token expiration
  const isTokenValid = useTokenExpireCheck();
  if (isTokenValid) {
    router.push("/");
    return;
  } else router.push("/chatter");

  return <div></div>;
};

export default Dashboard;
