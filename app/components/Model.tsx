'use client'

import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import CloseIcon from '@mui/icons-material/Close';
import { Fragment } from "react";

interface IModel {
    isOpen?: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Model:React.FC<IModel> = ({
    isOpen,
    onClose,
    children,
}) => {
  return (
    <Transition
      show={isOpen}
      as={Fragment}
    >
        <Dialog as="div" className="relative z-40"  onClose={onClose}>
            <Transition 
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-gray-500/25 transition-opacity" />
            </Transition>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <Transition
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <DialogPanel
                            className="
                                relative transform
                                overflow-hidden rounded-lg
                                bg-white px-4 pb-4
                                text-left shadow-xsl
                                transition-all w-full
                                sm:my-8 sm:w-full
                                sm:max-w-lg sm:p-6
                            "
                        >
                            <div className="
                                absolute right-0 top-0
                                hidden pr-4 pt-4 sm:block z-10
                            ">
                                <button 
                                    className="
                                        rounded-md bg-white text-gray-400
                                        focus:outline-none focus:ring-2
                                        focus:ring-orange-500
                                        focus:ring-offset-2"
                                    onClick={onClose}
                                >
                                    <span className="sr-only">Close</span>
                                    <CloseIcon className="size-6"/>
                                </button>
                            </div>
                            {children}
                        </DialogPanel>
                    </Transition>
                </div>
            </div>
        </Dialog>   
    </Transition>
  )
}

export default Model