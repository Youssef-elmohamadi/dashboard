import { useState, useRef, useEffect } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

const MultiSelect = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select options",
  disabled = false,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string | number) => {
    const isSelected = value.includes(optionValue);
    let newValue;
    if (isSelected) {
      newValue = value.filter((v) => v !== optionValue);
    } else {
      newValue = [...value, optionValue];
    }
    onChange(newValue);
  };

  const handleSelectAll = () => {
    const filteredValues = filteredOptions.map((opt) => opt.value);
    const newValue = [...new Set([...value, ...filteredValues])];
    onChange(newValue);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const filteredOptions = options.filter((option) =>
    option?.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const removeSelection = (optionValue: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = value.filter((v) => v !== optionValue);
    onChange(newValue);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
          {label}
        </label>
      )}
      <div
        className={`w-full cursor-pointer rounded-lg border bg-transparent outline-none transition ${isOpen
          ? "border-primary ring-2 ring-primary ring-opacity-20 dark:border-primary"
          : "border-stroke dark:border-form-strokedark hover:border-primary dark:hover:border-primary"
          } ${disabled ? "cursor-default bg-whiter dark:bg-form-input opacity-50" : ""}`}
        onClick={handleToggle}
      >
        <div className="flex min-h-[48px] items-center gap-2 py-2 pl-4 pr-10">
          {selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedOptions.slice(0, 3).map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 rounded-md bg-primary bg-opacity-10 px-2.5 py-1 text-sm font-medium text-primary dark:bg-primary dark:bg-opacity-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  {option.label}
                  <button
                    onClick={(e) => removeSelection(option.value, e)}
                    className="ml-1 text-primary hover:text-primary-dark"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </span>
              ))}
              {selectedOptions.length > 3 && (
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-meta-4 dark:text-gray-300">
                  +{selectedOptions.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>
          )}
        </div>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-200" style={{ transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)' }}>
          <svg
            className="fill-current text-gray-500"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.9107C14.7365 6.58527 15.2641 6.58527 15.5896 6.9107C15.915 7.23614 15.915 7.76377 15.5896 8.08921L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08921C4.08563 7.76377 4.08563 7.23614 4.41107 6.9107Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-lg border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
          {/* Search Input */}
          <div className="border-b border-stroke p-3 dark:border-strokedark">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-md border border-stroke bg-transparent py-2 pl-10 pr-4 text-sm outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                onClick={(e) => e.stopPropagation()}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 fill-current text-gray-400"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.3505 11.1495 3 8.25 3ZM1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25C15 11.9779 11.9779 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.9572 11.9572C12.2501 11.6643 12.7249 11.6643 13.0178 11.9572L16.2803 15.2197C16.5732 15.5126 16.5732 15.9874 16.2803 16.2803C15.9874 16.5732 15.5126 16.5732 15.2197 16.2803L11.9572 13.0178C11.6643 12.7249 11.6643 12.2501 11.9572 11.9572Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 border-b border-stroke px-3 py-2 dark:border-strokedark">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectAll();
              }}
              className="flex-1 rounded-md bg-primary bg-opacity-10 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-opacity-20 dark:bg-primary dark:bg-opacity-20 dark:hover:bg-opacity-30"
            >
              Select All
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              className="flex-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-meta-4 dark:text-gray-300 dark:hover:bg-opacity-80"
            >
              Clear All
            </button>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2.5 transition hover:bg-gray-50 dark:hover:bg-meta-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={value.includes(option.value)}
                      readOnly
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <span className="flex-1 text-sm text-black dark:text-white">
                    {option.label}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                {options.length === 0 ? "No options available" : "No results found"}
              </div>
            )}
          </div>

          {/* Footer */}
          {value.length > 0 && (
            <div className="border-t border-stroke px-4 py-2 dark:border-strokedark">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {value.length} item{value.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
