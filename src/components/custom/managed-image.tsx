import React, {useState} from 'react';
import clsx from 'clsx';

interface ManagedImageProps {
    src?: string;
    alt: string;
    wrapperClassName?: string;
    imgClassName?: string;
    loadingComponent?: React.ReactNode;
    onError?: React.ReactEventHandler<HTMLImageElement>;
    imgLoadingStateClassName?: string;
    imgLoadedStateClassName?: string;
    errorFallbackComponent?: React.ReactNode;
    defaultImageIdentifier?: string;
}

export const ManagedImage: React.FC<ManagedImageProps> = ({
                                                              src,
                                                              alt,
                                                              wrapperClassName,
                                                              imgClassName,
                                                              loadingComponent,
                                                              onError,
                                                              imgLoadingStateClassName = 'opacity-0 pointer-events-none',
                                                              imgLoadedStateClassName = 'opacity-100',
                                                              errorFallbackComponent,
                                                              defaultImageIdentifier = '/media/image.png',
                                                          }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isErrorState, setIsErrorState] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
        setIsErrorState(false);
    };

    const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
        const imgElement = event.target as HTMLImageElement;
        if (onError) {
            onError(event);
        }

        const isDefaultAlreadyTried = imgElement.dataset.defaultLoaded === 'true';
        const currentImgSrcIsDefault = defaultImageIdentifier && imgElement.src.includes(defaultImageIdentifier);

        if (isDefaultAlreadyTried || currentImgSrcIsDefault || !onError) {
            setIsErrorState(true);
        }
        setIsLoading(false);
    };

    if (isErrorState && errorFallbackComponent) {
        return <div
            className={clsx('flex items-center justify-center', wrapperClassName)}>{errorFallbackComponent}</div>;
    }

    if (isErrorState && !errorFallbackComponent) {
        return (
            <div className={clsx('flex items-center justify-center text-xs text-gray-500', wrapperClassName)}>
                {alt} (Không tải được)
            </div>
        );
    }

    return (
        <>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    {loadingComponent}
                </div>
            )}
            {src && (
                <img
                    key={src}
                    src={src}
                    alt={alt}
                    className={clsx(
                        imgClassName,
                        isLoading ? imgLoadingStateClassName : imgLoadedStateClassName,
                        'transition-opacity duration-300 ease-in-out'
                    )}
                    onLoad={handleLoad}
                    onError={handleError}
                />
            )}
        </>
    );
};
