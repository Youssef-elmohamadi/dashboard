import React from "react";
type Props = {
  imageUrl: string;
  linkUrl: string;
  altText?: string;
};
const AdBanner = ({ imageUrl, linkUrl, altText = "Ad Banner" }: Props) => {
  return (
    <a href={linkUrl}>
      <div className="w-full transition p-2 cursor-pointer duration-300 rounded-xl overflow-hidden">
        <img
          src={imageUrl}
          alt={altText}
          className="mx-auto w-full object-contain transition-opacity duration-300 hover:opacity-90"
        />
      </div>
    </a>
  );
};

export default AdBanner;
