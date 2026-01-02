import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useSearchParams } from "react-router-dom";

interface PriceRangeFilterProps {
  setValuesProp: (range: { min?: number | null; max?: number | null }) => void;
  setIsMenuOpen?: (open: boolean) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  setValuesProp,
  setIsMenuOpen,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation(["EndUserShop"]);
  const { dir } = useDirectionAndLanguage();
  const isRTL = dir === "rtl";

  // تحسين الأرقام لتكون أكثر قابلية للقراءة واستخدام العملة ديناميكياً
  const priceRanges = [
    { label: t("priceFilter.all"), min: null, max: null },
    { label: `0 - 50`, min: 0, max: 50000 },
    { label: `50 - 100`, min: 50000, max: 100000 },
    { label: `100 - 200`, min: 100000, max: 200000 },
    { label: `200 - 350`, min: 200000, max: 350000 },
    { label: `350 - 500`, min: 350000, max: 500000 },
  ];

  const getInitialRange = () => {
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    if (!min && !max) return priceRanges[0];
    const found = priceRanges.find(
      (r) => String(r.min) === min && String(r.max) === max
    );
    return found || priceRanges[0];
  };

  const [selectedRange, setSelectedRange] = useState(getInitialRange);

  useEffect(() => {
    setSelectedRange(getInitialRange());
  }, [searchParams]);

  const handleChange = (range: {
    label: string;
    min: number | null;
    max: number | null;
  }) => {
    const newParams = new URLSearchParams(searchParams);

    if (range.min == null && range.max == null) {
      newParams.delete("min");
      newParams.delete("max");
    } else {
      range.min != null
        ? newParams.set("min", String(range.min))
        : newParams.delete("min");
      range.max != null
        ? newParams.set("max", String(range.max))
        : newParams.delete("max");
    }

    setSearchParams(newParams);
    setSelectedRange(range);
    setValuesProp({ min: range.min, max: range.max });
    setIsMenuOpen && setIsMenuOpen(false);
  };

  return (
    <div
      className={`bg-white border border-gray-100 rounded-2xl p-5 mt-6 ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      {/* العنوان بنفس نمط التصنيفات والماركات */}
      <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-5 border-b border-gray-50 pb-4">
        {t("priceFilter.title")}
      </h2>

      {/* استخدام Grid لجعل الفلاتر تبدو منظمة وأنيقة */}
      <div className="grid grid-cols-1 gap-2">
        {priceRanges.map((range, idx) => {
          const isActive = selectedRange.label === range.label;
          return (
            <button
              key={idx}
              onClick={() => handleChange(range)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
                ${
                  isActive
                    ? "bg-red-50 text-[#d62828]"
                    : "bg-white hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-100"
                }`}
            >
              <div className="flex items-center gap-3">
                {/* Custom Radio Circle */}
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                  ${
                    isActive
                      ? "border-[#d62828]"
                      : "border-gray-300 group-hover:border-gray-400"
                  }`}
                >
                  {isActive && (
                    <div className="w-2 h-2 bg-[#d62828] rounded-full" />
                  )}
                </div>
                <span
                  className={`text-[13px] ${
                    isActive ? "font-black" : "font-medium"
                  }`}
                >
                  {range.label}
                  {range.min !== null && (
                    <span className="ms-1 text-[10px] opacity-60 uppercase">
                      {t("priceFilter.thousands")} {t("priceFilter.egp")}
                    </span>
                  )}
                </span>
              </div>

              {isActive && (
                <div className="w-1.5 h-1.5 bg-[#d62828] rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PriceRangeFilter;
