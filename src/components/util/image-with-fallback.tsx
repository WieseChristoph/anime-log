import { useState } from 'react';

import Image from 'next/image';

type ImageWithFallbackPropsType = {
    src: string;
    fallbackSrc: string;
    children?: React.ReactNode;
    className: string;
    alt: string;
    width?: number;
    height?: number;
};

const ImageWithFallback = ({
    src,
    fallbackSrc,
    children,
    className = '',
    alt = '',
    width,
    height,
}: ImageWithFallbackPropsType) => {
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
