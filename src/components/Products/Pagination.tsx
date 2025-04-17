const Pagination = ({
  nextPage,
  previousPage,
  canNextPage,
  canPreviousPage,
  pageIndex,
  pageSize ,
  totalCount , // تقدر تمرر القيمة الحقيقية لو عندك
}: any) => {
  const start = pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalCount);

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
          {totalCount}
        </span>{" "}
        Entries
      </span>

      <div className="inline-flex mt-2 xs:mt-0">
        <button
          onClick={previousPage}
          disabled={!canPreviousPage}
          className="flex items-center justify-center px-2 h-10 text-base font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="w-3.5 h-3.5 me-2 rtl:rotate-180"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 5H1m0 0 4 4M1 5l4-4"
            />
          </svg>
          Prev
        </button>

        <button
          onClick={nextPage}
          disabled={!canNextPage}
          className="flex items-center justify-center px-2 h-10 text-base font-medium text-white bg-gray-800 border-s border-gray-700 rounded-e hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <svg
            className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
