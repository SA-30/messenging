import { getCookie } from "./cookieHelpers";

const userData = getCookie("token")

const config = {
    headers: {
      Authorization: `Bearer ${userData}`,
    },
};

export default config;