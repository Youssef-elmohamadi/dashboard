import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useSearchParams } from "react-router-dom";

interface PriceRangeFilterProps {
  setValuesProp: (range: { min?: number; max?: number }) => void;
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
    { label: `0 - 50,000 ${t("priceFilter.egp")}`, min: 0, max: 50000 },
    {
      label: `50,000 - 100,000 ${t("priceFilter.egp")}`,
      min: 50000,
      max: 100000,
    },
    {
      label: `100,000 - 200,000 ${t("priceFilter.egp")}`,
      min: 100000,
      max: 200000,
    },
    {
      label: `200,000 - 350,000 ${t("priceFilter.egp")}`,
      min: 200000,
      max: 350000,
    },
    {
      label: `350,000 - 500,000 ${t("priceFilter.egp")}`,
      min: 350000,
      max: 500000,
    },
  ];

  const getInitialRange = () => {
    const min = searchParams.get("min");
    const max = searchParams.get("max");

    // تحويل القيم إلى أرقام أو null مع التعامل مع القيم غير الصالحة
    const minValue = min !== null && !isNaN(Number(min)) ? Number(min) : null;
    const maxValue = max !== null && !isNaN(Number(max)) ? Number(max) : null;

    // البحث عن نطاق مطابق
    const found = priceRanges.find(
      (r) =>
        (r.min === minValue || (r.min === null && minValue === null)) &&
        (r.max === maxValue || (r.max === null && maxValue === null))
    );

    return found || priceRanges[0]; // العودة إلى "الكل" إذا لم يتم العثور على تطابق
  };

  const [selectedRange, setSelectedRange] = useState(getInitialRange);
  const radioRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const currentRange = getInitialRange();
    setSelectedRange(currentRange);

    // تحديد التركيز على الراديو المحدد
    const index = priceRanges.findIndex(
      (r) =>
        (r.min === currentRange.min ||
          (r.min === null && currentRange.min === null)) &&
        (r.max === currentRange.max ||
          (r.max === null && currentRange.max === null))
    );
    if (index !== -1 && radioRefs.current[index]) {
      radioRefs.current[index]?.focus();
    }
  }, [searchParams, t, isMenuOpen]); // إضافة isMenuOpen للتأكد من التحديث عند فتح القائمة

  const handleChange = useCallback(
    (range: { min?: number | null; max?: number | null }, index: number) => {
      const newParams = new URLSearchParams(searchParams);

      if (range.min == null && range.max == null) {
        newParams.delete("min");
        newParams.delete("max");
      } else {
        if (range.min != null) {
          newParams.set("min", String(range.min));
        } else {
          newParams.delete("min");
        }
        if (range.max != null) {
          newParams.set("max", String(range.max));
        } else {
          newParams.delete("max");
        }
      }

      setSearchParams(newParams);
      setSelectedRange(range);
      setValuesProp(range);

      // تحديد التركيز يدويًا بعد التحديد
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
      className={`w-full p-5 bg-white border border-gray-200 rounded-md mt-4 ${
        isRTL ? "rtl text-right" : "ltr text-left"
      }`}
    >
      <h2 className="text-lg font-bold mb-4">{t("priceFilter.title")}</h2>
      <div className="space-y-3">
        {priceRanges.map((range, idx) => (
          <label
            key={idx}
            htmlFor={`priceRange-${idx}`}
            className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
          >
            <input
              type="radio"
              id={`priceRange-${idx}`}
              name="priceRange"
              ref={(el) => (radioRefs.current[idx] = el)}
              checked={
                (selectedRange.min === range.min ||
                  (selectedRange.min === null && range.min === null)) &&
                (selectedRange.max === range.max ||
                  (selectedRange.max === null && range.max === null))
              }
              onChange={() => handleChange(range, idx)}
              className="accent-red-600 focus:ring-red-500"
            />
            <span>{range.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PriceRangeMobileFilter);
