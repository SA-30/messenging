'use client'

import useOtherUser from "@/app/hooks/useOtherUser";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Conversation, User } from "@prisma/client";
import CloseIcon from '@mui/icons-material/Close';
import { format } from "date-fns";
import { Fragment, useMemo, useState } from "react";
import Avatar from '../../../../components/Avatar'
import { IconButton } from "@mui/material";
import ConformModel from "./ConformModel";

interface IProfileDrawer {
    data: Conversation & {
        users: User[];
    },
    isOpen: boolean;
    onClose: () => void;
}

const ProfileDrawer: React.FC<IProfileDrawer> = ({data, isOpen, onClose}) => {
  const [conformOpen, setConformOpen] = useState(false)
  const otherUser = useOtherUser(data)

  const joinedData = useMemo(() => {
    return format(new Date(otherUser.createdAt), 'PP')
  }, [otherUser.createdAt])

  const title = useMemo(() => {
    return data.name || otherUser.name
  },[data.name, otherUser.name])

  const statusText = useMemo(() => {
    if (data.isGroup) {
        return `${data.users.length} members `
    }

    return 'Active'
  },[data])

  return (
    <>
        <ConformModel isOpen={conformOpen} onClose={() => setConformOpen(false)} />
            {/* <div className="bg-red-500 p-5 ">
                <p className="text-black">Hello World!!!</p>
            </div>
        </ConformModel> */}
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative bg-black/20 z-40" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-inherit bg-opacity-40"/>
                </TransitionChild>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="
                            pointer-events-none
                            right-0 flex max-w-full
                            fixed inset-y-0 pl-10
                        ">
                            <TransitionChild
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="ease-in-out transition transform duration-200"
                                leaveTo="translate-x-full"
                            >
                                <DialogPanel className='pointer-events-auto w-screen max-w-md'>
                                    <div className="
                                        flex h-full flex-col 
                                        overflow-y-scroll 
                                        bg-white py-6 shadow-xl
                                    ">
                                        <div className="px-4 sm:px-6">
                                            <div className="flex items-start justify-end">
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="
                                                            rounded-md bg-white
                                                            text-gray-400 
                                                            hover:text-gray-500
                                                            focus:outline-none
                                                            focus:ring-2
                                                            focus:ring-orange-500
                                                            focus:ring-offset-2
                                                        "
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                            <IconButton onClick={onClose}>
                                                                <CloseIcon />
                                                            </IconButton>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            <div className="flex flex-col items-center">
                                                <div className="mb-2">
                                                    <Avatar user={otherUser}/>
                                                </div>
                                                <div>
                                                    {title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {statusText}
                                                </div>
                                                <div className="flex gap-10 y-8">
                                                    <div 
                                                        onClick={() => {}}
                                                        className="flex flex-col gap-3 cursor-pointer items-center hover:opacity-75"
                                                    >
                                                        <div className="size-10 mt-5 bg-neutral-100 rounded-full flex items-center justify-center">
                                                            <IconButton onClick={() => setConformOpen(true)}>
                                                                <DeleteOutlineIcon />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-full pb-5 pt-10 sm:px-0 sm:pt-0">
                                                    <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                                                        {!data.isGroup && (
                                                            <div>
                                                                <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                                                    Email
                                                                </dt>
                                                                <dd className="text-sm mt-1 text-gray-900 sm:col-span-2">
                                                                    {otherUser.email}
                                                                </dd>
                                                            </div>
                                                        )}
                                                        {!data.isGroup && (
                                                            <>
                                                                <hr />
                                                                <div>
                                                                    <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                                                        Joined
                                                                    </dt>
                                                                    <dd className="text-sm mt-1 text-gray-900 sm:col-span-2">
                                                                        <time dateTime={joinedData}>
                                                                            {joinedData}
                                                                        </time>
                                                                    </dd>
                                                                </div>
                                                            </>
                                                        )}
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    </>
  )
}

export default ProfileDrawer