"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FullConversationType } from "../Types";
import useOtherUser from "../hooks/useOtherUser";
import { useRouter } from "next/navigation";
import { getCookie } from "../helpers/cookieHelpers";
import { format } from "date-fns";
import Avatar from "./Avatar";
import axios from "axios";
import AvatarGroup from "./AvatarGroup";

interface ConversationListProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationListProps> = ({
  data,
  selected,
}) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const otherUser = useOtherUser(data);
  const cookie = getCookie("token");
  const router = useRouter();

  useEffect(() => {
    if (cookie) {
      axios
        .post("/api/getUserData", {
          token: cookie,
        })
        .then((response) => {
          const data = response.data;
          if (data.userInfo) {
            setUserInfo(data.userInfo);
          } else {
            console.log("Invalid token");
          }
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
        });
    }
  }, [cookie]);

  const handleClick = useCallback(() => {
    // router.push(`/chatter/chat?${data.id}`)
    router.push(`/chatter/${data.id}`);
  }, [router, data.id]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return userInfo?.email;
  }, [userInfo?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;

    const seenArray = lastMessage.seen || [];

    if (!userEmail) return false;

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return "Sent an attachment";
    if (lastMessage?.body) return lastMessage.body;

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={`
                w-full relative
                flex items-center
                space-x-3
                hover:bg-neutral-200
                dark:hover:bg-[#111111]
                rounded-lg transition
                cursor-pointer p-3
                ${
                  selected
                    ? "bg-neutral-200 dark:bg-[#111111]"
                    : "bg-white dark:bg-[#222222] "
                }
            `}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="font-medium text-gray-900 dark:text-gray-200">
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-500 font-light">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={`
                text-xs 
                truncate  
                text-gray-500
                ${
                  hasSeen
                    ? "text-gray-500"
                    : "text-slate-900 dark:text-slate-200 font-medium"
                }
        `}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
