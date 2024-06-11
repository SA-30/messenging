'use client'

import { Button, TextField } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, MouseEvent } from 'react';

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [logInStatus, setLogInStatus] = useState<{ msg: string; key: number } | null>(null);
    const [signInStatus, setSignInStatus] = useState<{ msg: string; key: number } | null>(null);
    
    const navigate = useRouter();

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
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            
            const response = await axios.post(
                "/api/login",
                data,
            );

            console.log("login: ", response);
            setSignInStatus({ msg: "Success", key: Math.random() });
            localStorage.setItem("userData", JSON.stringify(response.data));
            navigate.push("/chatter");
        } catch (error) {
            console.error(error);
            setLogInStatus({
                msg: "Invalid username or Password",
                key: Math.random(),
            });
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

            const response = await axios.post(
                "/api/register",
                data,
            );

            console.log("cli",response);
            setSignInStatus({ msg: "Success", key: Math.random() });
            localStorage.setItem("userData", JSON.stringify(response.data));
            navigate.push("/");
        } catch (error: any) {
            console.error(error);
            if (error.response.status === 405) {
                setLogInStatus({
                    msg: "User with this email ID already exists",
                    key: Math.random(),
                });
            } else if (error.response.status === 406) {
                setLogInStatus({
                    msg: "Username already taken, please choose another name",
                    key: Math.random(),
                });
            } else {
                setLogInStatus({
                    msg: "Registration failed. Please try again.",
                    key: Math.random(),
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-leftside-container">
                <Image height={200} width={200} className="logo" src='/images/Chater.png' alt="Logo" />
            </div>
            <div className="login-rightside-container">
                <h2>
                    {!isSignUp ? "Register your Account" : "Login to your Account"}
                </h2>
                {!isSignUp &&
                    <>
                        <TextField
                            onChange={changeHandler}
                            name="name"
                            value={data.name}
                            id="outlined-basic"
                            label="Username"
                            variant="outlined"
                            />
                        <br />
                    </>
                }
                
                <TextField
                    onChange={changeHandler}
                    name="email"
                    value={data.email}
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                />
                <br />

                <TextField
                    onChange={changeHandler}
                    name="password"
                    value={data.password}
                    id="outlined-basic"
                    label="Password"
                    type="password"
                    variant="outlined"
                    autoComplete="current-password"
                />
                <br />
                <Button
                    onClick={isSignUp ? loginHandler : signUpHandler}
                    id="login-button"
                    variant="contained"
                >
                    {isSignUp ? "LOGIN" : "SIGN UP"}
                </Button>
                <span>
                    {!isSignUp
                        ? "Already have an Account? "
                        : "Don't have an Account? "}
                    <a href="#" onClick={handleToggle}>
                        {" "}
                        {!isSignUp ? "Login" : "Sign Up"}
                    </a>
                </span>
                {logInStatus && <div className="status-message">{logInStatus.msg}</div>}
                {signInStatus && <div className="status-message">{signInStatus.msg}</div>}
            </div>
        </div>
    );
};

export default Auth;
