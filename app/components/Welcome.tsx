'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCookie } from "../helpers/cookieHelpers";
import axios from "axios";

const Welcome = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const nav = useRouter();

  const cookie = getCookie("token");
  // if (!cookie) {
  //   nav.push("/");
  // }

  useEffect(() => {
    if (cookie) {
      axios.post('/api/getUserData', {
        token: cookie 
      })
      .then((response) => {
        const data = response.data;
        if (data.userInfo) {
          setUserInfo(data.userInfo);
        } else {
          console.log('Invalid token');
        }
      })
      .catch((error) => {
        console.error('Error verifying token:', error);
      });
    }
  }, [cookie]);

  return (
    <div className=" py-5 sm:py-[10px] px-[10px] sm:px-[10px]  h-full">
        <div className="Welcome-page dark:dark h-full p-10" >
            <Image src='/images/Chater.png' alt="Logo" height={200} width={200} />
            <b>Hi, {userInfo?.name}</b>
            <p className="sm:text-sm text-xs">View and text to friends and family.</p>
        </div>
    </div>
  );
};

export default Welcome;
