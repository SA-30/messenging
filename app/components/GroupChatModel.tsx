'use client'

import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import config from "../helpers/config";
import toast from "react-hot-toast";
import Model from "./Model";
import Select from "./Select";
interface IGroupChatModel {
    isOpen?: boolean;
    onClose: () => void;
    users: User[];
}

const GroupChatModel: React.FC<IGroupChatModel> = ({
    isOpen,
    onClose,
    users,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      members: [],
    },
  })

  const members = watch('members')

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    axios.post('/api/accessChat',{
      ...data, isGroup: true
    }, config)
     .then(() => {
        router.refresh()
        onClose()
      })
     .catch((err) => {
        // if (err.status === 400) toast.error("Group length must be greater than 2")
        toast.error("Select more members")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Model isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Create a group chat
            </h2>
            <div className="mt-10 flex flex-col gap-y-8">
              <div className="mt-5">
                <label 
                  htmlFor="name" 
                  className="block mb-1 text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <input 
                  disabled={isLoading}
                  id="name"
                  type="text"
                  className=" block w-full border-2 p-2  outline-none rounded-md border-gray-300  focus:border-orange-500 "
                  placeholder="Your group name"
                  {...register("name", { required: true })}
                />
              </div>
              <div>
                <Select 
                  disabled={isLoading}
                  label="Members"
                  value={members}
                  onChange={(value) => setValue('members', value, {
                    shouldValidate: true,
                  })}
                  options={
                    users?.map((user) => ({
                      label: user.name,
                      value: user.id,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button 
            disabled={isLoading}
            onClick={onClose}
            className="
            p-2 bg-gray-200 rounded
            text-gray-600 hover:text-white
            font-semibold text-sm
            transition hover:bg-gray-500
          ">
            Cancel
          </button>
          <button 
            disabled={isLoading}
            type='submit'
            className="
            p-2 rounded
            bg-orange-600 text-white
            font-semibold text-sm
            transition hover:bg-orange-500
          ">
            Create Group
          </button>
        </div>
      </form>
    </Model>
  )
}

export default GroupChatModel