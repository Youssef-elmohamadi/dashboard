import React from "react";
import SearchResultsDropdown from "./SearchBar";

interface DesktopSearchBarProps {
  dir: string;
}

const DesktopSearchBar: React.FC<DesktopSearchBarProps> = ({ dir }) => {
  return (
    <div className="md:flex items-center gap-2 hidden flex-[3] lg:flex-[2]">
      <SearchResultsDropdown lang="en" dir={dir} />
    </div>
  );
};

export default React.memo(DesktopSearchBar);