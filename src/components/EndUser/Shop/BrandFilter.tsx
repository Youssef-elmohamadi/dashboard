import { useState } from "react";
import { useTranslation } from "react-i18next";
import ArrowDown from "../../../icons/ArrowDown";
import { useSearchParams } from "react-router-dom";
import { useBrands } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import LazyImage from "../../common/LazyImage";

type Brand = {
  id: number;
  name_en: string;
  name_ar: string;
  image: string;
};

type BrandFilterProps = {
  setIsMenuOpen?: () => void;
  isMenuOpen?: boolean;
};

const BrandFilter: React.FC<BrandFilterProps> = ({
  setIsMenuOpen,
  isMenuOpen,
}) => {
  const { t } = useTranslation("EndUserShop");
  const [showBrands, setShowBrands] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading } = useBrands();
  const brands: Brand[] = data || [];
  const { lang } = useDirectionAndLanguage();

  const activeBrandId = searchParams.get("brand_id");

  const handleSelectBrand = (brandId?: number) => {
    if (brandId) {
      searchParams.set("brand_id", String(brandId));
    } else {
      searchParams.delete("brand_id");
    }
    setSearchParams(searchParams);
    if (isMenuOpen && setIsMenuOpen) setIsMenuOpen();
  };

  return (
    <div className="p-5">
      {isLoading ? (
        <div className="p-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-50 animate-pulse rounded-xl w-full"
            />
          ))}
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowBrands((prev) => !prev)}
            className="group w-full flex justify-between items-center pb-4 mb-4 border-b border-gray-50"
          >
            <span className="text-sm font-black uppercase tracking-widest text-gray-900 group-hover:text-[#d62828] transition-colors">
              {t("brands")}
            </span>
            <div className="bg-gray-50 group-hover:bg-red-50 p-1.5 rounded-lg transition-colors">
              <ArrowDown
                className={`w-3.5 transition-transform duration-500 ${
                  showBrands ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          <div
            className={`grid transition-all duration-500 ease-in-out ${
              showBrands
                ? "grid-rows-[1fr] opacity-100 mt-5"
                : "grid-rows-[0fr] opacity-0 pointer-events-none"
            }`}
          >
            <div className="overflow-hidden">
              <ul className="space-y-1.5 custom-scrollbar max-h-64 overflow-y-auto pr-1">
                {/* خيار "كل الماركات" - بنفس حجم خط "كل الفئات" */}
                <li>
                  <button
                    onClick={() => handleSelectBrand(undefined)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300
                      ${
                        !activeBrandId
                          ? "bg-red-50 text-[#d62828] shadow-sm shadow-red-100/50"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        !activeBrandId
                          ? "bg-[#d62828] animate-pulse"
                          : "bg-gray-300 opacity-40"
                      }`}
                    />
                    <span className="text-[13px] font-bold">
                      {t("allBrands")}
                    </span>
                  </button>
                </li>

                {/* عرض الماركات */}
                {brands?.map((brand) => {
                  const isActive = activeBrandId === String(brand.id);
                  return (
                    <li key={brand.id} className="group/brand">
                      <button
                        onClick={() => handleSelectBrand(brand.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300
                          ${
                            isActive
                              ? "bg-red-50 text-[#d62828] shadow-sm shadow-red-100/50"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          {/* اللوجو - مصمم بوضوح */}
                          <div
                            className={`w-7 h-7 rounded-lg bg-white p-1 border border-gray-50 flex items-center justify-center transition-transform duration-300 ${
                              !isActive && "group-hover/brand:scale-110"
                            }`}
                          >
                            <LazyImage
                              src={brand.image}
                              alt={brand[`name_${lang}`]}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          {/* النص - تم رفعه ليكون 13px كما في التصنيفات */}
                          <span
                            className={`text-[13px] truncate ${
                              isActive
                                ? "font-black"
                                : "font-medium group-hover/brand:translate-x-1 rtl:group-hover/brand:-translate-x-1 transition-transform"
                            }`}
                          >
                            {brand[`name_${lang}`]}
                          </span>
                        </div>

                        {isActive && (
                          <div className="w-1.5 h-1.5 bg-[#d62828] rounded-full" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BrandFilter;
