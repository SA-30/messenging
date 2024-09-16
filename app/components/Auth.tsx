"use client";

import { Button, TextField } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, MouseEvent } from "react";
import { toast } from "react-hot-toast";
import { getCookie } from "../helpers/cookieHelpers";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useRouter();

  const token = getCookie("token");
  if (token) navigate.push("/chatter");

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setData({ name: "", email: "", password: "" });
  };

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/login", data);

      if (response.status === 200) {
        toast.success("😊 Login successfull!");

        navigate.push("/chatter");
      }
    } catch (error) {
      toast.error(`🥺 "Login failed!"`);
    } finally {
      setLoading(false);
    }
  };

  const signUpHandler = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post("/api/register", data);

      if (response.status === 201) {
        toast.success("😊 User created successfully!");

        setIsSignUp(true);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(`🥺 Login failed! `);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container bg-gray-800/70 h-[90vh] w-[90vw] flex">
      <div className="flex flex-1 bg-gradient-to-br from-orange-200 to-orange-500 flex-col justify-center items-center">
        <h2 className="font-bold text-4xl mb-2">
          {!isSignUp ? "Register your Account" : "Login to your Account"}
        </h2>
        <p className="text-center text-sm">
          Register or login to access more information.
        </p>
        <div className="flex mt-5 flex-col border-2 border-orange-200/70 p-5 rounded-md">
          {!isSignUp && (
            <>
              <label
                htmlFor="name"
                className="text-sm font-semibold text-orange-600"
              >
                Name
              </label>
              <input
                onChange={changeHandler}
                name="name"
                className="bg-orange-200 outline-none rounded-sm p-2"
                placeholder="Username"
                type="text"
                value={data.name}
                id="name"
              />
              <br />
            </>
          )}
          <label
            htmlFor="name"
            className="text-sm font-semibold text-orange-600"
          >
            Email
          </label>
          <input
            onChange={changeHandler}
            name="email"
            type="text"
            className="bg-orange-200 outline-none rounded-sm p-2"
            placeholder="Email"
            value={data.email}
            id="email"
          />
          <br />
          <label
            htmlFor="name"
            className="text-sm font-semibold text-orange-600"
          >
            Password
          </label>
          <input
            onChange={changeHandler}
            name="password"
            value={data.password}
            id="password"
            type="password"
            className="bg-orange-200 outline-none rounded-sm p-2"
            placeholder="Password"
            autoComplete="current-password"
          />
          <br />
          <button
            onClick={isSignUp ? loginHandler : signUpHandler}
            id="login-button"
            className="font-bold bg-blue-600 p-2 mb-2 text-white rounded-md"
          >
            {isSignUp ? "LOGIN" : "SIGN UP"}
          </button>
        </div>

        <span className="font-bold text-orange-900 text-sm mt-2">
          {!isSignUp ? "Already have an Account? " : "Don't have an Account? "}
          <a
            href="#"
            className="font-bold text-sm underline text-rose-700"
            onClick={handleToggle}
          >
            {" "}
            {!isSignUp ? "Login" : "Sign Up"}
          </a>
        </span>
      </div>
    </div>
  );
};

export default Auth;

// <div className="login-container bg-gray-800/70 h-[90vh] w-[90vw] flex">
//   <div className="login-leftside-container">
//     <Image
//       height={200}
//       width={200}
//       className="logo"
//       src="/images/Chater.png"
//       alt="Logo"
//     />
//   </div>
//   <div className="login-rightside-container">
//     <h2 className="font-bold">
//       {!isSignUp ? "Register your Account" : "Login to your Account"}
//     </h2>
//     {!isSignUp && (
//       <>
//         <TextField
//           onChange={changeHandler}
//           name="name"
//           value={data.name}
//           id="outlined-basic"
//           label="Username"
//           variant="outlined"
//         />
//         <br />
//       </>
//     )}

//     <TextField
//       onChange={changeHandler}
//       name="email"
//       value={data.email}
//       id="outlined-basic"
//       label="Email"
//       variant="outlined"
//     />
//     <br />

//     <TextField
//       onChange={changeHandler}
//       name="password"
//       value={data.password}
//       id="outlined-basic"
//       label="Password"
//       type="password"
//       variant="outlined"
//       autoComplete="current-password"
//     />
//     <br />
//     <Button
//       onClick={isSignUp ? loginHandler : signUpHandler}
//       id="login-button"
//       variant="contained"
//       className="font-bold"
//     >
//       {isSignUp ? "LOGIN" : "SIGN UP"}
//     </Button>
//     <span className="font-bold text-black text-sm">
//       {!isSignUp ? "Already have an Account? " : "Don't have an Account? "}
//       <a
//         href="#"
//         className="font-bold text-black text-sm underline"
//         onClick={handleToggle}
//       >
//         {" "}
//         {!isSignUp ? "Login" : "Sign Up"}
//       </a>
//     </span>
//   </div>
// </div>
