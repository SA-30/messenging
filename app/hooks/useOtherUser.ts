import { User } from "@prisma/client"
import { FullConversationType } from "../Types"
import { useEffect, useMemo, useState } from "react"
import { getCookie } from "../helpers/cookieHelpers"
import axios from "axios"

const useOtherUser = (conversation: FullConversationType | {
    users: User[]
}) => {
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

    const otherUser = useMemo(() => {
        const currentUserEmail = userInfo?.email

        const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail)
        return otherUser[0]
    }, [userInfo?.email, conversation.users])

    return otherUser
}

export default useOtherUser