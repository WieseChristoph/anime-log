import { useState } from "react";

import Image from "next/image";

interface Props {
    src: string;
    fallbackSrc: string;
    children?: React.ReactNode;
    className: string;
    alt: string;
    width?: number;
    height?: number;
}

const ImageWithFallback: React.FC<Props> = ({
    src,
    fallbackSrc,
    children,
    className = "",
    alt = "",
    width,
    height,
}) => {
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
};

export default ImageWithFallback;
