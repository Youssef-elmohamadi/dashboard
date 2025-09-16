import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useGeneralSearch } from "../../../hooks/Api/useGeneralSearch";
import { Product } from "../../../types/Product";
import { Category } from "../../../types/Categories";
import SearchIcon from "../../../icons/SearchIcon";
import StarIcon from "../../../icons/StarIcon";

interface SearchResponseData {
  products: Product[];
  categories: Category[];
}

interface SearchDropdownProps {
  lang: string;
  dir: string;
  toggleMobileSearch?: () => void;
}

const SearchResultsDropdown: React.FC<SearchDropdownProps> = ({
  lang,
  dir,
  toggleMobileSearch,
}) => {
  const { t } = useTranslation(["searchResults"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // لتقليل عدد استدعاءات الـ API
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error } = useGeneralSearch(
    debouncedSearchTerm,
    "user"
  );

  const searchResults: SearchResponseData = data?.data || {
    products: [],
    categories: [],
  };
  const hasResults =
    searchResults.products.length > 0 || searchResults.categories.length > 0;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.length >= 2 && !isLoading && !isError) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [debouncedSearchTerm, isLoading, isError, searchResults]);

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

  const handleResultClick = () => {
    setShowDropdown(false);
    setSearchTerm("");
    setDebouncedSearchTerm("");
    if (toggleMobileSearch) {
      toggleMobileSearch();
    }
  };

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <div className="flex items-center gap-2 relative w-full">
        <input
          type="text"
          placeholder={t("search_placeholder")}
          className="rounded-full text-sm px-4 py-2 border border-gray-200 focus:outline-none w-full"
          aria-label={t("search_placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchTerm.length >= 2 || (hasResults && !isLoading)) {
              setShowDropdown(true);
            }
          }}
        />
        <div
          className={`absolute ${
            dir === "ltr" ? "right-4" : "left-4"
          } text-gray-500`}
        >
          <SearchIcon />
        </div>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-gray-600">
              {t("loadingResults")}
            </div>
          )}

          {isError && (
            <div className="p-4 text-center text-red-600 ">
              {t("errorFetchingResults")}
            </div>
          )}

          {!isLoading && !isError && hasResults && (
            <>
              {searchResults.categories.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-md font-semibold text-gray-700  mb-2">
                    {t("categoriesFound")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.categories.map((category) => (
                      <NavLink
                        key={category.id}
                        to={`/${lang}/category/${category.id}`}
                        onClick={handleResultClick}
                        className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors duration-200"
                      >
                        {category[`name_${lang}`]}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.products.length > 0 && (
                <div className="p-4">
                  <h3 className="text-md font-semibold text-gray-700  mb-2">
                    {t("productsFound")}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {searchResults.products.map((product) => (
                      <NavLink
                        key={product.id}
                        to={`/${lang}/product/${product.id}`}
                        onClick={handleResultClick}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
                      >
                        <img
                          src={
                            product.images?.[0]?.image ??
                            `https://placehold.co/60x60/F3E8FF/3B0764?text=Product`
                          }
                          alt={product[`name_${lang}`]}
                          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                          onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://placehold.co/60x60/F3E8FF/3B0764?text=Product";
                          }}
                        />
                        <div className="flex-grow">
                          <h4 className="text-base font-medium text-gray-800 line-clamp-1">
                            {product[`name_${lang}`]}
                            {/* {product.name_ar} */}
                          </h4>
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="flex text-yellow-400 mr-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <StarIcon
                                  key={i}
                                  className={
                                    i < Math.floor(product.rating || 0)
                                      ? "w-3 h-3"
                                      : "w-3 h-3 text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs">
                              (
                              {typeof product.rating === "number"
                                ? product.rating.toFixed(1)
                                : "0.0"}
                              )
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0">
                          {(product.discount_price ?? 0) > 0 &&
                          (product.discount_price ?? 0) <
                            Number(product.price) ? (
                            <>
                              <span className="text-md font-bold text-gray-800 ">
                                {Number(product.price ?? 0).toFixed(2)}{" "}
                                {t("currency")}
                              </span>
                              <span className="text-xs text-gray-500 line-through">
                                {Number(product.price).toFixed(2)}{" "}
                                {t("currency")}
                              </span>
                            </>
                          ) : (
                            <span className="text-md font-bold text-gray-800 ">
                              {Number(product.price).toFixed(2)} {t("currency")}
                            </span>
                          )}
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!isLoading &&
            !isError &&
            !hasResults &&
            debouncedSearchTerm.length >= 2 && (
              <div className="p-4 text-center text-gray-600">
                {t("noResultsFound")}
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchResultsDropdown);
