import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useSearchParams } from "react-router";

interface PriceRangeFilterProps {
  setValuesProp: (range: { min?: number; max?: number }) => void;
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

  const priceRanges = [
    { label: t("priceFilter.all"), min: null, max: null },
    { label: `0 - 50,000 ${t("priceFilter.egp")}`, min: 0, max: 50000 },
    { label: `50,000 - 100,000 ${t("priceFilter.egp")}`, min: 50000, max: 100000 },
    { label: `100,000 - 200,000 ${t("priceFilter.egp")}`, min: 100000, max: 200000 },
    { label: `200,000 - 350,000 ${t("priceFilter.egp")}`, min: 200000, max: 350000 },
    { label: `350,000 - 500,000 ${t("priceFilter.egp")}`, min: 350000, max: 500000 },
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

  const handleChange = (range: { min?: number | null; max?: number | null }) => {
    const newParams = new URLSearchParams(searchParams);

    if (range.min == null && range.max == null) {
      newParams.delete("min");
      newParams.delete("max");
    } else {
      range.min != null ? newParams.set("min", String(range.min)) : newParams.delete("min");
      range.max != null ? newParams.set("max", String(range.max)) : newParams.delete("max");
    }

    setSearchParams(newParams);
    setSelectedRange(range);
    setValuesProp(range);
    setIsMenuOpen && setIsMenuOpen(false);
  };

  return (
    <div className={`w-full p-5 bg-white border border-gray-200 rounded-md mt-4 ${isRTL ? "rtl text-right" : "ltr text-left"}`}>
      <h2 className="text-lg font-bold mb-4">{t("priceFilter.title")}</h2>
      <div className="space-y-3">
        {priceRanges.map((range, idx) => (
          <label key={idx} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input
              type="radio"
              name="priceRange"
              checked={selectedRange.label === range.label}
              onChange={() => handleChange(range)}
              className="accent-red-600 focus:ring-red-500"
            />
            <span>{range.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};


export default PriceRangeFilter;
