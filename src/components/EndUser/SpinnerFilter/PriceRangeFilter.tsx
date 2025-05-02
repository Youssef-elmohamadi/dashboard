import React, { useState, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import { useSearchParams } from "react-router-dom";
interface PriceRangeFilterProps {
  setValuesProp: (range: { min: number; max: number }) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  setValuesProp,
}) => {
  const [searchParams] = useSearchParams();
  const min = Number(searchParams.get("min")) || 0;
  const max = Number(searchParams.get("max")) || 100000;
  const [values, setValues] = useState<[number, number]>([min, max]);

  const STEP = 1;
  const MIN = 0;
  const MAX = 100000;

  return (
    <div className="w-full mx-auto p-5 bg-white border mt-6">
      <h2 className="text-lg font-bold mb-4">Price Filter</h2>
      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
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
                colors: ["#e5e7eb", "#8b5cf6", "#e5e7eb"],
                min: MIN,
                max: MAX,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="h-4 w-4 rounded-full border-2 border-purple-600 bg-white flex items-center justify-center"
          />
        )}
      />
      <div className="flex justify-between text-sm text-gray-600 mt-3">
        <span>{values[0]} EGP</span>
        <span>{values[1]} EGP</span>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
