import React from "react";
import SearchBar from "./SearchBar";
import { TFunction } from "i18next";
import { TfiClose } from "react-icons/tfi";
import SearchResultsDropdown from "./SearchBar";
interface MobileSearchOverlayProps {
  isMobileSearchOpen: boolean;
  toggleMobileSearch: () => void;
  t: TFunction<"EndUserHeader", undefined>;
  dir: string;
}

const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({
  isMobileSearchOpen,
  toggleMobileSearch,
  t,
  dir,
}) => {
  return (
    <div
      className={`absolute -top-4 w-full left-0 right-0 z-50 bg-white p-4 md:hidden
        transition-all duration-300 ease-in-out transform ${
          isMobileSearchOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
    >
      <div className="flex justify-end mb-2">
        <TfiClose
          className="text-base cursor-pointer text-secondary"
          onClick={toggleMobileSearch}
          aria-label="Close Mobile Search"
        />
      </div>
      <SearchResultsDropdown toggleMobileSearch={toggleMobileSearch} lang="ar" dir={dir} />
    </div>
  );
};

export default MobileSearchOverlay;
