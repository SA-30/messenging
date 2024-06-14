interface ISetCookie {
    name: string;
    value: string;
    daysToExpire: number;
  }
  
  // function to get cookie
  function getCookie(cookieName: string) {
    if (typeof document === 'undefined') {
      return null;
    }

    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
  
    return null;
  }
  // Function to set cookie
  function setCookie(cookieConfig: ISetCookie): void {
    const { name, value, daysToExpire } = cookieConfig;
  
    const date = new Date();
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }
  // Function to clear a cookie
  function clearCookie(cookieName: string): void {
    const pastDate = new Date();
    pastDate.setTime(pastDate.getTime() - 1);
    const expires = "expires=" + pastDate.toUTCString();
    document.cookie = `${cookieName}=; ${expires}; path=/`;
  }
  
  export { setCookie, clearCookie, getCookie };
  