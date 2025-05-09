import { FaFilter } from "react-icons/fa";
import { useTranslation } from "react-i18next";

type Option = { label: string; value: string | number };
type Field = {
  key: string;
  label: string;
  type: "input" | "select";
  options?: Option[];
};

const SearchTable = ({
  fields,
  setSearchParam,
}: {
  fields: Field[];
  setSearchParam: (key: string, value: string) => void;
}) => {
  const { t } = useTranslation(["SearchTables"]);

  const getTranslatedLabel = (label: string) => {
    const translation = t(`searchTable.fields.${label}`);
    return translation !== `searchTable.fields.${label}` ? translation : label;
  };

  return (
    <div className="rounded-2xl border mb-5 border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="gap-4 px-6 py-5 flex-row items-center justify-between">
        {/* Title */}
        <h3 className="flex gap-2 mb-4 items-center text-base m-1 font-medium text-gray-800 dark:text-gray-200">
          <FaFilter />
          {t("searchTable.title")}
        </h3>

        <div className="border-t dark:border-gray-800 border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl p-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-200">
                {getTranslatedLabel(field.label)}
              </label>

              {field.type === "input" ? (
                <input
                  type="text"
                  onChange={(e) => setSearchParam(field.key, e.target.value)}
                  className="w-full border dark:border-gray-800 border-gray-200 rounded px-3 py-2 text-gray-900 dark:text-gray-200 text-sm outline-none"
                  placeholder={t("searchTable.placeholder", {
                    field: getTranslatedLabel(field.label),
                  })}
                />
              ) : (
                <select
                  onChange={(e) => setSearchParam(field.key, e.target.value)}
                  className="w-full border dark:border-gray-800 border-gray-200 rounded px-3 py-2 text-gray-900 dark:text-gray-200 text-sm outline-none"
                >
                  <option
                    className="text-gray-900 dark:bg-gray-800 dark:text-gray-200 text-sm outline-none"
                    value=""
                  >
                    {t("searchTable.all")}
                  </option>
                  {field.options?.map((option) => (
                    <option
                      className="text-gray-900 dark:bg-gray-800  dark:text-gray-200 text-sm outline-none"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchTable;
