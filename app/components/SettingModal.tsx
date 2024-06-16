import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Model from "./Model";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import config from "../helpers/config";

interface ISettingModal {
    currentUser: User;
    isOpen: boolean;
    onClose: () => void;
}

const SettingModal: React.FC<ISettingModal> = ({
    currentUser,
    isOpen,
    onClose,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image,
        },
    });

    const image = watch('image');

    const handleUpload = (result: any) => {
        setValue('image', result?.info?.secure_url, {
            shouldValidate: true
        });
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/settings', data, config)
            .then(() => {
                router.refresh();
                onClose();
            })
            .catch(() => toast.error("Error occurred while submitting"))
            .finally(() => setIsLoading(false));
    };

    return (
        <Model isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                    <p className="text-lg font-medium text-gray-900">Profile</p>
                    <p className="text-sm mt-1 text-gray-600">Edit your profile.</p>
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
                            placeholder={currentUser?.name}
                            defaultValue={currentUser?.name}
                            {...register("name", { required: true })}
                        />
                    </div>
                    <div className="mt-6">
                        <label 
                            className="block text-sm font-medium leading-6 text-gray-900"
                            htmlFor="photo"
                        >
                            Photo
                        </label>
                        <div className="mt-2 flex items-center gap-x-3">
                            <Image 
                                height={48}
                                width={48}
                                className="rounded-full"
                                alt="profile_image" 
                                src={image || currentUser?.image || '/images/avatar.png'}
                            />
                            <CldUploadButton 
                                options={{maxFiles: 1}}
                                onSuccess={handleUpload}
                                uploadPreset="chatter"
                            >
                                <button 
                                    disabled={isLoading}
                                    className="p-2 rounded bg-blue-500 text-white font-semibold text-sm transition hover:bg-blue-600"
                                >
                                    Upload
                                </button>
                            </CldUploadButton>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center justify-end gap-x-3">
                        <button 
                            disabled={isLoading}
                            onClick={onClose}
                            className="p-2 rounded bg-slate-200 font-semibold text-sm transition hover:bg-slate-400"
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={isLoading}
                            type="submit"
                            className="p-2 rounded bg-orange-500 text-white font-semibold text-sm transition hover:bg-orange-600"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </Model>
    );
}

export default SettingModal;
