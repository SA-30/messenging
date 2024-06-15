'use client'

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import SendIcon from "@mui/icons-material/Send";
import { IconButton } from "@mui/material";

interface MessageInputProps {
    placeholder?: string;
    id: string;
    type?: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors
}

const MessageInput:React.FC<MessageInputProps> = ({
    placeholder,
    id,
    type,
    required,
    register,
    errors
}) => {
  return (
    <div className="relative flex w-full">
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            autoComplete={id}
            required={required}
            {...register(id, { required })}
            className={"search-box box-shadow1 rounded-[10px] w-full px-5 dark:dark"}
        />
        <button
            className="rounded-full cursor-pointer"
        >
            <IconButton
                className={" p-2 ml-2 text-gray-500 dark:dark"}>
                <SendIcon className='size-8'/>
            </IconButton>
        </button>
    </div>
  )
}

export default MessageInput