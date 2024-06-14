'use client'

import { Button, TextField } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, ChangeEvent, MouseEvent } from 'react';
import { toast } from 'react-hot-toast';
import { getCookie } from '../helpers/cookieHelpers';

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [data, setData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    
    const navigate = useRouter();

    const token = getCookie("token")
    if(token) navigate.push('/chatter')

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
            const response = await axios.post(
                "/api/login",
                data,
            );

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

            const response = await axios.post(
                "/api/register",
                data,
            );

            if (response.status === 201) {
                toast.success("😊 User created successfully!");

                setIsSignUp(true)
            }
        } catch (error: any) {
            console.error(error);
                toast.error(`🥺 Login failed! `);
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
            </div>
        </div>
    );
};

export default Auth;
