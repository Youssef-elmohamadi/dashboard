import React from "react";

const Pagination = ({
  handlePageChange,
  canNextPage,
  canPreviousPage,
  pageIndex,
  pageSize,
  totalItems,
  pageCount,
}: any) => {
  const start = pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalItems);

  return (
    <div className="flex flex-col items-center mt-4">
      <span className="text-sm text-gray-700 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {start}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalItems}
        </span>{" "}
        Entries
      </span>

      <nav aria-label="Page navigation example">
        <ul className="inline-flex -space-x-px text-base h-10 mt-2">
          <li>
            <button
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={!canPreviousPage}
              className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
            >
              Previous
            </button>
          </li>

          {Array.from({ length: pageCount }).map((_, i) => (
            <li key={i}>
              <button
                onClick={() => handlePageChange(i)}
                className={`flex items-center justify-center px-4 h-10 leading-tight border ${
                  i === pageIndex
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                } dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                {i + 1}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={!canNextPage}
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
