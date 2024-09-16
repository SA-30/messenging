/* eslint-disable camelcase */
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { getCookieClient } from "../helpers/cookieHelpers";

function clearCookie(cookieName: string): void {
  const pastDate = new Date();
  pastDate.setTime(pastDate.getTime() - 1);
  const expires = "expires=" + pastDate.toUTCString();
  document.cookie = `${cookieName}=; ${expires}; path=/`;
}

const useTokenExpireCheck = () => {
  const [isTokenValid, setIsTokenValid] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const access_token = getCookieClient("token");

  useEffect(() => {
    const checkAccess = () => {
      if (!access_token) {
        setIsTokenValid(false);
        return;
      }

      // Decode token and check expiration
      try {
        const user = jwtDecode(access_token);
        if (user.exp !== undefined) {
          const isExpired = dayjs.unix(user.exp).diff(dayjs(), "second");

          if (isExpired < 0) {
            // Token is expired
            if (typeof window !== "undefined") {
              setIsTokenValid(false);
              // Logout functionality
              clearCookie("token");
            }
          } else {
            setIsTokenValid(true);
          }
        }
      } catch (error) {
        console.error("Failed to decode token", error);
        setIsTokenValid(false);
      }
    };

    checkAccess();
  }, [access_token, pathname, router]);

  return isTokenValid;
};
export default useTokenExpireCheck;
