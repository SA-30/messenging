
'use client'

import Image from "next/image";
import Model from "./Model";

interface IImageModel {
    src?: string | null;
    isOpen?: boolean;
    onClose: () => void;
}

const ImageModel:React.FC<IImageModel> = ({
    src,
    isOpen,
    onClose,
}) => {
  if (!src) return null;

  return (
    <Model isOpen={isOpen} onClose={onClose}>
        <div className="w-[80vw] h-[80vh]">
            <Image 
                alt="sent_image"
                className="object-cover"
                fill
                src={src}
            />
        </div>
    </Model>
  )
}

export default ImageModel