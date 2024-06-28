"use client";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import config from "@/app/helpers/config";
import React from "react";

import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import axios from "axios";
import MessageInput from "./MessageInput";
import { CldUploadButton } from "next-cloudinary";

const Form = ({ conversationId }: { conversationId: string }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post(
      "/api/sendMessage",
      {
        ...data,
        conversationId,
      },
      config
    );
  };

  const handleUpload = (result: any) => {
    axios.post(
      "/api/sendMessage",
      {
        image: result?.info?.secure_url,
        conversationId,
      },
      config
    );
  };

  return (
    <div
      className="
            flex 
            items-center 
            rounded-[10px]
    "
    >
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset="chatter"
      >
        <IconButton className={"p-2 text-sky-500 dark:dark"}>
          <AddPhotoAlternateIcon className="size-8" />
        </IconButton>
      </CldUploadButton>
      <div className={"w-full pl-4 dark:dark "}>
        <form className="w-full " onSubmit={handleSubmit(onSubmit)}>
          <MessageInput
            id="message"
            register={register}
            errors={errors}
            required
            placeholder="Type a Message"
          />
        </form>
      </div>
    </div>
  );
};

export default Form;
