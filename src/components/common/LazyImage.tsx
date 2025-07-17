import { useState } from "react";
import { useInView } from "react-intersection-observer";
import type { ImgHTMLAttributes } from "react";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

const LazyImage = ({ src, alt, className = "", ...rest }: LazyImageProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      ref={ref}
      className={`w-full h-full flex justify-center ${
        isLoading ? "bg-gray-100 animate-pulse" : ""
      }`}
    >
      {inView && (
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/product/placeholder-image.webp";
          }}
          decoding="async"
          {...rest}
        />
      )}
    </div>
  );
};

export default LazyImage;
