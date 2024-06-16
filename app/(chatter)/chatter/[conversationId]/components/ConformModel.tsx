import Model from "@/app/components/Model";
import axios from "axios";
import WarningIcon from '@mui/icons-material/Warning';
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { DialogTitle } from "@headlessui/react";
import config from "@/app/helpers/config";

interface IConformModel {
    isOpen?: boolean;
    onClose: () => void;
}

const ConformModel: React.FC<IConformModel> = ({
    isOpen,
    onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const path = usePathname()
  const conversationId = path.split('/').pop()

  const onDelete = useCallback(() => {
    setIsLoading(false)

    axios.delete(`/api/${conversationId}`, config)
    .then(() => {
        onClose()
        router.push('/chatter')
        router.refresh()
    })
    .catch(() => {
        toast.error("Error deleting the conversation.")
    })
    .finally(() => {
        setIsLoading(false)
    })
  }, [conversationId, router, onClose])

  return (
    <Model isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex flex sm:items-center">
        <div className="
            mx-auto flex justify-center size-12 
            flex-shrink-0 items-center 
            rounded-full bg-red-100 
            sm:size-10 sm:mx-0
        ">  
            <WarningIcon className="size-6 text-red-400"/>
        </div>
        <div className="mt-1 text-center sm:ml-4 sm:lt-0 sm:text-left">
            <DialogTitle
                as='h3'
                className="text-base leading-5 font-semibold text-gray-900"
            >
                Delete Conversation
            </DialogTitle>
            <div className="mt-1">
                <p className="text-sm text-gray-500">
                    Are you sure you want to delete this conversation ?
                </p>
            </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 gap-2 sm:flex sm:flex-row-reverse">
        <button 
            disabled={isLoading}
            onClick={onDelete}
            className="
            p-2 bg-red-200 rounded
            text-red-600 hover:text-white
            font-semibold text-sm
            transition hover:bg-red-500
        ">
            Delete
        </button>
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
      </div>
    </Model>
  )
}

export default ConformModel