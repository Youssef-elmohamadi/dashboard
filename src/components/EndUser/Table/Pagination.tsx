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
  const { t } = useTranslation(["EndUserOrderHistory"]);
  return (
    <div className="flex flex-col items-center mt-4">
      <span className="text-sm text-gray-700 ">
        {t("pagination.showing")}
        <span className="font-semibold text-gray-900 ">{start}</span>{" "}
        {t("pagination.of")}
        <span className="font-semibold text-gray-900 ">{end}</span>{" "}
        {t("pagination.to")}
        <span className="font-semibold text-gray-900 ">{totalItems}</span>{" "}
        {t("pagination.entries")}
      </span>

      <nav aria-label="Page navigation example">
        <ul className="inline-flex -space-x-px text-base h-10 mt-2">
          <li>
            <button
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={!canPreviousPage}
              className="inline-flex items-center gap-2 rounded-s-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800"
            >
              {t("pagination.previous")}
            </button>
          </li>

          {Array.from({ length: pageCount }).map((_, i) => (
            <li key={i}>
              <button
                onClick={() => handlePageChange(i)}
                className={`flex items-center justify-center px-4 h-10 leading-tight border ${
                  i === pageIndex
                    ? "bg-blue-600 text-white font-bold border-blue-600"
                    : "inline-flex items-center gap-2  border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 "
                }`}
              >
                {i + 1}
              </button>
            </li>
          ))}

          <li>
            <button
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={!canNextPage}
              className="inline-flex items-center gap-2 border rounded-e-lg border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 "
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
