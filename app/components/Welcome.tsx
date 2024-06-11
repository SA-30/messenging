'use client'

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Welcome = () => {
    const storedData = localStorage.getItem("userData");
    const userData = storedData ? JSON.parse(storedData) : null;
    const nav = useRouter();

//   if (!userData) {
//     nav.push("/");
//   }

  return (
    <div className="p-[10px] h-full">
        <div className="Welcome-page dark:dark h-full" >
            <Image src='/images/Chater.png' alt="Logo" height={200} width={200} />
            <b>Hi, {userData?.data?.name}</b>
            <p>View and text to friends and family.</p>
        </div>
    </div>
  );
};

export default Welcome;
