import { AdBannerProps } from "../../../types/Home";
import LazyImage from "../../common/LazyImage";

const AdBanner = ({
  imageUrl,
  linkUrl,
  altText = "Ad Banner",
}: AdBannerProps) => {
  return (
    <a href={linkUrl}>
      <div className="w-full transition p-2 cursor-pointer duration-300 rounded-xl overflow-hidden">
        <LazyImage
          src={imageUrl}
          alt={altText}
          className="mx-auto w-full h-auto object-contain transition-opacity duration-300 hover:opacity-90"
        />
      </div>
    </a>
  );
};

export default AdBanner;
