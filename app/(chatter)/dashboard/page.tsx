"use client";

import { getCookie } from "@/app/helpers/cookieHelpers";
import { useRouter } from "next/navigation";
import React from "react";

const Dashboard = () => {
  const router = useRouter();

  const token = getCookie("token");

  if (!token) router.push("/");
  else router.push("/chatter");
  return <div></div>;
};

export default Dashboard;
