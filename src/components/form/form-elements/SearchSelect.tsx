
import { useState } from 'react';

type Props = {
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  title?: string;
  data?: { id: number; name: string }[];
};

const SearchSelect = ({
  name,
  value,
  onChange,
  className,
  title,
  data,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('');

  // فلترة البيانات بناءً على مصطلح البحث
  const filteredData = data?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search..."
        className="block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 py-1.5 sm:py-2 px-3 mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full sm:text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 py-1.5 sm:py-2 px-3 ${className}`}
      >
        <option value="" disabled>
          {title}
        </option>
        {filteredData?.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      {/* للتأكيد أن الخيار لا يظهر قبل البحث */}
      {filteredData?.length === 0 && searchTerm && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-neutral-900 text-gray-500 p-2 rounded-b-lg mt-2">
          No results found
        </div>
      )}
    </div>
  );
};


export default SearchSelect;
