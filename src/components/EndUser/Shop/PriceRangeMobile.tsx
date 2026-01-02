import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useSearchParams } from "react-router-dom";

interface PriceRangeFilterProps {
  setValuesProp: (range: { min?: number | null; max?: number | null }) => void;
  setIsMenuOpen?: (open: boolean) => void;
  isMenuOpen?: boolean;
}

const PriceRangeMobileFilter: React.FC<PriceRangeFilterProps> = ({
  setValuesProp,
  setIsMenuOpen,
  isMenuOpen,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation(["EndUserShop"]);
  const { dir } = useDirectionAndLanguage();
  const isRTL = dir === "rtl";

  const priceRanges = [
    { label: t("priceFilter.all"), min: null, max: null },
    { label: `0 - 50k`, min: 0, max: 50000 },
    { label: `50k - 100k`, min: 50000, max: 100000 },
    { label: `100k - 200k`, min: 100000, max: 200000 },
    { label: `200k - 350k`, min: 200000, max: 350000 },
    { label: `350k - 500k`, min: 350000, max: 500000 },
  ];

  const getInitialRange = () => {
    const min = searchParams.get("min");
    const max = searchParams.get("max");
    const minValue = min !== null && !isNaN(Number(min)) ? Number(min) : null;
    const maxValue = max !== null && !isNaN(Number(max)) ? Number(max) : null;

    const found = priceRanges.find(
      (r) =>
        (r.min === minValue || (r.min === null && minValue === null)) &&
        (r.max === maxValue || (r.max === null && maxValue === null))
    );
    return found || priceRanges[0];
  };

  const [selectedRange, setSelectedRange] = useState(getInitialRange);
  const radioRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // useEffect(() => {
  //   const currentRange = getInitialRange();
  //   setSelectedRange(currentRange);

  //   const index = priceRanges.findIndex(
  //     (r) =>
  //       (r.min === currentRange.min ||
  //         (r.min === null && currentRange.min === null)) &&
  //       (r.max === currentRange.max ||
  //         (r.max === null && currentRange.max === null))
  //   );
  //   if (index !== -1 && radioRefs.current[index]) {
  //     radioRefs.current[index]?.focus();
  //   }
  // }, [searchParams, isMenuOpen]);

  const handleChange = useCallback(
    (
      range: { label: string; min: number | null; max: number | null },
      index: number
    ) => {
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

      setTimeout(() => {
        if (radioRefs.current[index]) {
          radioRefs.current[index]?.focus();
        }
      }, 0);

      if (isMenuOpen && setIsMenuOpen) {
        setIsMenuOpen(false);
      }
    },
    [searchParams, setSearchParams, setValuesProp, isMenuOpen, setIsMenuOpen]
  );

  return (
    <div
      className={`w-full p-5 bg-white border border-gray-100 rounded-2xl ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      {/* العنوان مطابقة للـ Sidebar */}
      <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-5 border-b border-gray-50 pb-4">
        {t("priceFilter.title")}
      </h2>

      <div className="grid grid-cols-1 gap-2">
        {priceRanges.map((range, idx) => {
          const isActive =
            (selectedRange.min === range.min ||
              (selectedRange.min === null && range.min === null)) &&
            (selectedRange.max === range.max ||
              (selectedRange.max === null && range.max === null));

          return (
            <button
              key={idx}
              ref={(el) => (radioRefs.current[idx] = el)}
              onClick={() => handleChange(range, idx)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
                ${
                  isActive
                    ? "bg-red-50 text-[#d62828] shadow-sm shadow-red-100/50"
                    : "bg-white hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-100"
                }`}
            >
              <div className="flex items-center gap-3">
                {/* Custom Radio Circle مطابقة للتصميم */}
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
                      {t("priceFilter.egp")}
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

export default React.memo(PriceRangeMobileFilter);
