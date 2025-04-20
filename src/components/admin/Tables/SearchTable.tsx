import React, { useState, useEffect } from "react";

type SearchParams = {
  name?: boolean;
  email?: boolean;
  phone?: boolean;
  setSearchParam: (key: string, value: string) => void;
};

const SearchTable = ({ name, email, phone, setSearchParam }: SearchParams) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchBy, setSearchBy] = useState("Filter Search");
  const [searchKey, setSearchKey] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSearchBySelect = (key: string) => {
    setSearchBy(key.charAt(0).toUpperCase() + key.slice(1)); // Capitalize
    setSearchKey(key);
    setSearchValue(""); // reset previous value
    setDropdownOpen(false);
  };

  // ✅ debounce implementation
  useEffect(() => {
    if (!searchKey) return;

    const delayDebounce = setTimeout(() => {
      setSearchParam(searchKey, searchValue);
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounce);
  }, [searchKey, searchValue]);

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex relative">
        <button
          type="button"
          onClick={toggleDropdown}
          className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600"
        >
          {searchBy}
          <svg
            className="w-2.5 h-2.5 ms-2.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 z-10 bg-white divide-y divide-gray-100 rounded-lg w-44 dark:bg-gray-700">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {name && (
                <li>
                  <button
                    type="button"
                    onClick={() => handleSearchBySelect("name")}
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Name
                  </button>
                </li>
              )}
              {email && (
                <li>
                  <button
                    type="button"
                    onClick={() => handleSearchBySelect("email")}
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Email
                  </button>
                </li>
              )}
              {phone && (
                <li>
                  <button
                    type="button"
                    onClick={() => handleSearchBySelect("phone")}
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Phone
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="relative w-full">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 dark:bg-gray-700 dark:border-s-gray-700 focus:outline-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Enter your search..."
            disabled={!searchKey}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchTable;
