import { FullMessageType } from "@/app/Types";
import Avatar from "@/app/components/Avatar";
import useUserData from "@/app/hooks/useUserData";
import { format } from "date-fns";
import Image from "next/image";

interface IMessageBox {
    data: FullMessageType;
    isLast?: boolean;
}

const MessageBox: React.FC<IMessageBox> = ({
    data,
    isLast,
 }) => {
    const userData = useUserData()
    const isOwn = userData?.email === data?.sender?.email
    const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ')

    const container = `flex gap-3 p-4 ${isOwn && 'justify-end'}`
    const avatar = `${isOwn && 'order-2'}`
    const body = `flex flex-col gap-2 ${isOwn && 'items-end'}`
    const message = `text-sm w-fit overflow-hidden 
        ${isOwn ? 'bg-sky-500 text-white' : 'bg-slate-100'}
        ${data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'}    
    `

    return (
        <div className={container}>
            <div className={avatar}>
                <Avatar user={data.sender} size='smaller'/>
            </div>
            <div className={body}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">
                        {data.sender.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {format(new Date(data.createdAt), 'p')}
                    </div>
                </div>
                <div className={message}>
                    {data.image ? (
                        <Image 
                            alt="Image"
                            height='100'
                            width='100'
                            src={data.image}
                            className="
                                object-cover cursor-pointer
                                hover:scale-110 transition
                            "
                        />
                    ): (
                        <div className="text-sm ">
                            {data.body}
                        </div>
                    )}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div className="text-xs font-light text-gray-500">
                        {`Seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MessageBox