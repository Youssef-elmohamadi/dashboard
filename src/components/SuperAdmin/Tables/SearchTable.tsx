import { FaFilter } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";

type Option = { label: string; value: string | number };
type Field = {
  key: string;
  label: string;
  type: "input" | "select" | "date";
  options?: Option[];
};

const SearchTable = ({
  fields,
  setSearchParam,
  searchValues,
}: {
  fields: Field[];
  setSearchParam: (key: string, value: string) => void;
  searchValues: any;
}) => {
  const { t } = useTranslation(["SearchTables"]);

  const getTranslatedLabel = (label: string) => {
    const translation = t(`searchTable.fields.${label}`);
    return translation !== `searchTable.fields.${label}` ? translation : label;
  };

  return (
    <div className="rounded-2xl border mb-5 border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="gap-4 px-6 py-5 flex-row items-center justify-between">
        <h3 className="flex gap-2 mb-4 items-center text-base m-1 font-medium text-gray-800 dark:text-gray-200">
          <FaFilter />
          {t("searchTable.title")}
        </h3>

        <div className="border-t dark:border-gray-800 border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl p-4">
          {fields?.map((field) => (
            <div key={field.key}>
              <Label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-200">
                {getTranslatedLabel(field.label)}
              </Label>

              {field.type === "input" && (
                <Input
                  type="text"
                  onChange={(e) => setSearchParam(field.key, e.target.value)}
                  className="w-full border dark:border-gray-800 border-gray-200 rounded px-3 py-2 text-gray-900 dark:text-gray-200 text-sm outline-none"
                  placeholder={t("searchTable.placeholder", {
                    field: getTranslatedLabel(field.label),
                  })}
                />
              )}

              {field.type === "select" && (
                <Select
                  onChange={(value) => setSearchParam(field.key, value)}
                  className="w-full border dark:border-gray-800 border-gray-200 rounded px-3 py-2 text-gray-900 dark:text-gray-200 text-sm outline-none"
                  options={field.options}
                  placeholder={t("searchTable.fields.All")}
                  value={searchValues[field.key] || ""}
                />
              )}

              {field.key === "from_date" && (
                <div>
                  <input
                    type="datetime-local"
                    onChange={(e) => setSearchParam(field.key, e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-2 dark:text-gray-500 dark:border-gray-800"
                  />
                </div>
              )}
              {field.key === "to_date" && (
                <div>
                  <input
                    type="datetime-local"
                    onChange={(e) => setSearchParam(field.key, e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-2 dark:text-gray-500 dark:border-gray-800"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchTable;
