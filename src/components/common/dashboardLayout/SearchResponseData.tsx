import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useGeneralSearch } from "../../../hooks/Api/useGeneralSearch";
import { Product } from "../../../types/Product";
import { Category } from "../../../types/Categories";

interface SearchResponseData {
  products: Product[];
  categories: Category[];
}

interface SearchDropdownProps {
  lang?: string;
  dir: string;
  userType: "admin" | "super_admin";
  // toggleMobileSearch?: () => void;
}

const SearchResultsDropdown: React.FC<SearchDropdownProps> = ({
  lang,
  dir,
  userType,
}) => {
  const { t } = useTranslation(["searchResults"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isError } = useGeneralSearch(
    debouncedSearchTerm,
    "dmin" // Assuming "dmin" is a fixed context for the search, if not, it should be dynamic
  );

  const searchResults: SearchResponseData = data?.data || {
    products: [],
    categories: [],
  };
  const hasResults =
    searchResults.products.length > 0 || searchResults.categories.length > 0;

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay for debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Manage dropdown visibility based on search term and results status
  useEffect(() => {
    // OR if there are results (even if input is cleared later, show results until cleared)
    if (
      debouncedSearchTerm.length >= 2 ||
      (hasResults && !isLoading && !isError && searchTerm === "")
    ) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [debouncedSearchTerm, hasResults, isLoading, isError, searchTerm]); // Added searchTerm to dependency array for showing dropdown if results exist after clearing input

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle clicking a search result
  const handleResultClick = () => {
    setShowDropdown(false);
    setSearchTerm(""); // Clear search term after clicking a result
    setDebouncedSearchTerm(""); // Clear debounced term as well
  };

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <div className="flex items-center relative w-full">
        <div className="hidden lg:block">
          <form onSubmit={(e) => e.preventDefault()}>
            {" "}
            {/* Prevent form submission on Enter */}
            <div className="relative">
              <span
                className={`absolute -translate-y-1/2 pointer-events-none ${
                  dir === "rtl" ? "right-4" : "left-4"
                } top-1/2`}
              >
                <svg
                  className="fill-gray-500 dark:fill-gray-400"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                    fill=""
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder={t("search_placeholder")}
                aria-label={t("search_placeholder") || "Search"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  // Show dropdown if input has content or if there were previous results
                  if (
                    searchTerm.length > 0 ||
                    (debouncedSearchTerm.length >= 2 && hasResults)
                  ) {
                    setShowDropdown(true);
                  }
                }}
                ref={inputRef}
                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10
                           dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-brand-600 xl:w-[430px]"
              />

              <button
                type="button"
                className={`absolute ${
                  dir === "rtl" ? "left-2.5" : "right-2.5"
                } top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500
                           dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300`}
              >
                <span> ⌘ </span>
                <span> K </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-96 overflow-y-auto
                        dark:bg-gray-800 dark:border-gray-700"
        >
          {isLoading &&
            debouncedSearchTerm.length >= 2 && ( // Only show loading if a real search is in progress
              <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                {t("loadingResults") || "Loading results..."}
              </div>
            )}
          {isError &&
            debouncedSearchTerm.length >= 2 && ( // Only show error if a real search has failed
              <div className="p-4 text-center text-red-600 dark:text-red-400">
                {t("errorFetchingResults") || "Error fetching results."}
              </div>
            )}
          {!isLoading &&
            !isError &&
            !hasResults &&
            debouncedSearchTerm.length >= 2 && ( // Only show no results if a search was actually performed and yielded nothing
              <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                {t("noResultsFound") || "No results found for your search."}
              </div>
            )}
          {!isLoading && !isError && hasResults && (
            <>
              {searchResults.categories.length > 0 && (
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t("categoriesFound") || "Categories"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.categories.map((category) => (
                      <NavLink
                        key={category.id}
                        to={
                          userType === "admin"
                            ? `/admin/categories`
                            : `/super_admin/categories/update/${category.id}`
                        }
                        onClick={handleResultClick}
                        className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-sm"
                      >
                        <span className="text-gray-700 dark:text-gray-200">
                          {category[`name_${lang}`]}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.products.length > 0 &&
                searchResults.categories.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700" />
                )}
              {searchResults.products.length > 0 && (
                <div className="py-2">
                  <h3 className="px-3 py-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    {t("productsFound") || "Products"}
                  </h3>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {searchResults.products.map((product) => (
                      <NavLink
                        key={product.id}
                        to={`/${userType}/products/details/${product.id}`}
                        onClick={handleResultClick}
                        className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-sm"
                      >
                        <img
                          src={
                            product.images?.find(
                              (img: any) => img.is_main === 1
                            )?.image ||
                            `https://placehold.co/40x40/4F46E5/FFFFFF?text=Prod` // Brand-like color for placeholder
                          }
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-sm flex-shrink-0 border border-gray-100 dark:border-gray-600 mr-3"
                        />
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-800 dark:text-gray-100 line-clamp-1">
                            {product.name}
                          </h4>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          <span className="font-semibold text-gray-700 dark:text-gray-200">
                            {Number(product.price).toFixed(2)}{" "}
                            {t("currency") || "EGP"}
                          </span>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResultsDropdown;
