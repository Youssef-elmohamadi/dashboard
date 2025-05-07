import { FaFilter } from "react-icons/fa";
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
  return (
    <div
      className={`rounded-2xl border mb-5 border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]`}
    >
      <div className="gap-4 px-6 py-5 flex-row items-center justify-between">
        {/* Title */}
        <h3 className="flex gap-2 items-center text-base m-1 font-medium text-gray-800 dark:text-white/90">
          <FaFilter />
          Search
        </h3>
        <div className="border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl p-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium mb-1">
                {field.label}
              </label>
              {field.type === "input" ? (
                <input
                  type="text"
                  onChange={(e) => setSearchParam(field.key, e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder={`Enter ${field.label}`}
                />
              ) : (
                <select
                  onChange={(e) => setSearchParam(field.key, e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">All</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
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
