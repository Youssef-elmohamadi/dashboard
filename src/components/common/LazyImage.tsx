import { useEffect, useRef, useState } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export default function LazyImage({
  src,
  alt,
  className = "",
  ...rest
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px", // <-- strict
        threshold: 0.01, // <-- لازم 1% بس يدخل الشاشة
      }
    );

    if (imgRef.current) observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`h-full flex justify-center items-center overflow-hidden  ${
        isLoading ? "bg-gray-100 animate-pulse" : ""
      }`}
    >
      {isVisible && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-300`}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            setIsLoading(false);
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/product/placeholder-image.webp";
          }}
          decoding="async"
          {...rest}
        />
      )}

      {!isVisible && (
        <img
          ref={imgRef}
          style={{ opacity: 0, position: "absolute" }}
          alt={alt}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
