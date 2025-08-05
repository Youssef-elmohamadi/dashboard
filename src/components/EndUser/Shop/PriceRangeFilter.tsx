import React, { useState } from "react";
import { Range, getTrackBackground } from "react-range";
import { useSearchParams } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useTranslation } from "react-i18next";
interface PriceRangeFilterProps {
  setValuesProp: (range: { min: number; max: number }) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  setValuesProp,
}) => {
  const [searchParams] = useSearchParams();
  const min = Number(searchParams.get("min")) || 0;
  const max = Number(searchParams.get("max")) || 10000;
  const [values, setValues] = useState<[number, number]>([min, max]);
  const { dir } = useDirectionAndLanguage();
  const STEP = 1;
  const MIN = 0;
  const MAX = 10000;
  const isRTL = dir === "rtl";
  const { t } = useTranslation(["EndUserShop"]);
  return (
    <div
      className={`w-full mx-auto p-5 bg-white border border-gray-200 mt-6 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <h2 className="text-lg font-bold mb-4">{t("priceFilter.title")}</h2>
      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        rtl={isRTL}
        onChange={(vals) => setValues(vals as [number, number])}
        onFinalChange={(vals) => setValuesProp({ min: vals[0], max: vals[1] })}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "8px",
              borderRadius: "4px",
              background: getTrackBackground({
                values,
                colors: isRTL
                  ? ["#e5e7eb", "#d62828", "#e5e7eb"].reverse()
                  : ["#e5e7eb", "#d62828", "#e5e7eb"],
                min: MIN,
                max: MAX,
                rtl: isRTL,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="h-4 w-4 rounded-full border-2 border-[#d62828] bg-white flex items-center justify-center"
          />
        )}
      />
      <div className="flex justify-between text-sm text-gray-600 mt-3">
        <span>
          {values[0]} {t("priceFilter.egp")}
        </span>
        <span>
          {values[1]} {t("priceFilter.egp")}
        </span>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
