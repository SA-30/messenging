import { useEffect, useState } from "react";
import { getCookie } from "../helpers/cookieHelpers";
import axios from "axios";

const useUserData = () => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const cookie = getCookie("token");
  
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

    return userInfo
}

export default useUserData