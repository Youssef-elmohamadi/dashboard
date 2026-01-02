import React from "react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  handlePageChange: (pageIndex: number) => void;
  canNextPage: boolean;
  canPreviousPage: boolean;
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  pageCount: number;
}

const Pagination: React.FC<PaginationProps> = ({
  handlePageChange,
  canNextPage,
  canPreviousPage,
  pageIndex,
  pageSize,
  totalItems,
  pageCount,
}) => {
  const start = pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalItems);
  const { t } = useTranslation(["PaginationDashboardTables"]);

  const getPageNumbers = () => {
    const pages = [];
    const showRange = 2; 

    for (let i = 0; i < Math.min(2, pageCount); i++) {
      pages.push(i);
    }

    // صفحات حول الحالية
    for (
      let i = Math.max(pageIndex - showRange, 2);
      i <= Math.min(pageIndex + showRange, pageCount - 3);
      i++
    ) {
      pages.push(i);
    }

    // آخر صفحتين
    for (let i = Math.max(pageCount - 2, 0); i < pageCount; i++) {
      pages.push(i);
    }

    // إزالة التكرار
    return Array.from(new Set(pages)).sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center mt-4">
      <span className="text-sm text-gray-700 dark:text-gray-400">
        {t("pagination.showing")}{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {start}
        </span>{" "}
        {t("pagination.to")}{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {end}
        </span>{" "}
        {t("pagination.of")}{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalItems}
        </span>{" "}
        {t("pagination.entries")}
      </span>

      <nav aria-label="Page navigation example" className="mt-2">
        <ul className="inline-flex flex-wrap items-center justify-center gap-1 text-base">
          {/* Previous */}
          <li>
            <button
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={!canPreviousPage}
              className="inline-flex items-center gap-2 rounded-s-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {t("pagination.previous")}
            </button>
          </li>

          {/* Page numbers */}
          {pageNumbers.map((i, idx) => {
            const prev = pageNumbers[idx - 1];
            const isGap = prev !== undefined && i - prev > 1;
            return (
              <React.Fragment key={i}>
                {isGap && (
                  <li className="px-2 text-gray-500 dark:text-gray-400">...</li>
                )}
                <li>
                  <button
                    onClick={() => handlePageChange(i)}
                    className={`flex items-center justify-center px-3 py-2 border rounded-md ${
                      i === pageIndex
                        ? "bg-brand-500 text-white font-bold border-brand-500"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                </li>
              </React.Fragment>
            );
          })}

          {/* Next */}
          <li>
            <button
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={!canNextPage}
              className="inline-flex items-center gap-2 rounded-e-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {t("pagination.next")}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
