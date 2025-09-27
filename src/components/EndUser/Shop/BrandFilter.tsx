import { useState } from "react";
import { useTranslation } from "react-i18next";
import ArrowDown from "../../../icons/ArrowDown";
import { useSearchParams } from "react-router-dom";
import { useBrands } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

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

const BrandFilter: React.FC<BrandFilterProps> = ({ setIsMenuOpen, isMenuOpen }) => {
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

    if (isMenuOpen) setIsMenuOpen();
  };

  return (
    <div className="border border-gray-200 p-4 space-y-2 mt-6">
      {isLoading ? (
        <div className="text-center py-10">{t("loadingBrands")}</div>
      ) : (
        <>
          <button
            onClick={() => setShowBrands((prev) => !prev)}
            className="font-bold w-full flex justify-between items-center"
          >
            {t("brands")}
            <ArrowDown
              className={`transition-transform duration-300 w-4 ${
                showBrands ? "rotate-180" : ""
              }`}
            />
          </button>

          {showBrands && (
            <ul className="mt-4 space-y-2">
              {/* All Brands option */}
              <li>
                <button
                  onClick={() => handleSelectBrand(undefined)}
                  className={`flex items-center gap-2 transition ${
                    !activeBrandId
                      ? "text-[#d62828] font-semibold"
                      : "text-gray-500 hover:text-[#d62828]"
                  }`}
                >
                  {t("allBrands")}
                </button>
              </li>

              {/* Render brands */}
              {brands?.map((brand) => (
                <li key={brand.id}>
                  <button
                    onClick={() => handleSelectBrand(brand.id)}
                    className={`flex items-center gap-2 transition ${
                      activeBrandId === String(brand.id)
                        ? "text-[#d62828] font-semibold"
                        : "text-gray-500 hover:text-[#d62828]"
                    }`}
                  >
                    <img
                      src={brand.image}
                      alt={brand[`name_${lang}`]}
                      className="w-6 h-6 object-contain"
                    />
                    {brand[`name_${lang}`]}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default BrandFilter;
