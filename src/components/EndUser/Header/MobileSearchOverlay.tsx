import React from "react";
import { TFunction } from "i18next";
import SearchResultsDropdown from "./SearchBar";
import CloseIcon from "../../../icons/CloseIcon";
interface MobileSearchOverlayProps {
  isMobileSearchOpen: boolean;
  toggleMobileSearch: () => void;
  t: TFunction<"EndUserHeader", undefined>;
  dir: string;
}

const MobileSearchOverlay: React.FC<MobileSearchOverlayProps> = ({
  isMobileSearchOpen,
  toggleMobileSearch,
  dir,
}) => {
  return (
    <div
      className={`absolute -top-4 w-full left-0 right-0 z-0 bg-white p-4 md:hidden
        transition-all duration-300 ease-in-out transform ${
          isMobileSearchOpen
            ? "translate-y-0 opacity-100 z-50"
            : "-translate-y-full opacity-0 z-0"
        }`}
    >
      <div className="flex justify-end mb-2">
        <CloseIcon
          className="w-6 cursor-pointer text-secondary"
          onClick={toggleMobileSearch}
          aria-label="Close Mobile Search"
        />
      </div>
      <SearchResultsDropdown
        toggleMobileSearch={toggleMobileSearch}
        lang="ar"
        dir={dir}
      />
    </div>
  );
};

export default MobileSearchOverlay;
