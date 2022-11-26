import Image from "next/image";
import { useState } from "react";

interface Props {
    src: string;
    fallbackSrc: string;
    children?: React.ReactNode;
    className?: string;
    alt?: string;
    width?: string;
    height?: string;
}

function ImageWithFallback({
    src,
    children,
    className,
    alt,
    width,
    height,
    fallbackSrc,
}: Props) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            className={className}
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
        >
            {children}
        </Image>
    );
}

export default ImageWithFallback;
