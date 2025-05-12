import { FaFilter } from "react-icons/fa";
import { useTranslation } from "react-i18next";
const FilterRangeDate = ({
  setSearchParam,
}: {
  setSearchParam: (key: string, value: string) => void;
}) => {
  const { t } = useTranslation(["DateFilter"]);
  return (
    <div className="rounded-2xl border mb-5 border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="gap-4 px-6 py-5 flex-row items-center justify-between">
        <h3 className="flex gap-2 items-center text-base mb-3 font-medium text-gray-800 dark:text-white/90">
          <FaFilter />
          {t("title")}
        </h3>

        <div className="border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl p-4">
          <div>
            <label className="block text-sm font-medium mb-3 dark:text-white">
              {t("startDate")}
            </label>
            <input
              type="date"
              onChange={(e) => setSearchParam("start_date", e.target.value)}
              className="w-full border rounded px-3 py-2 dark:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-3 dark:text-white">
              {t("endDate")}
            </label>
            <input
              type="date"
              onChange={(e) => setSearchParam("end_date", e.target.value)}
              className="w-full border rounded px-3 py-2 dark:text-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterRangeDate;
