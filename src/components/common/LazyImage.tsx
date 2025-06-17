import { useState } from "react";
import { useInView } from "react-intersection-observer";

const LazyImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      ref={ref}
      className={`w-full h-full ${
        isLoading ? "bg-gray-100 animate-pulse" : ""
      }`}
    >
      {inView && (
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={() => setIsLoading(false)}
        />
      )}
    </div>
  );
};
export default LazyImage;
