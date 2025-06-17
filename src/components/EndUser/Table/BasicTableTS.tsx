import { useTable } from "react-table";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import Loading from "../../common/Loading";
import { useTranslation } from "react-i18next";

interface BasicTableProps<T> {
  columns: any;
  data: T[];
  totalItems: number;
  isLoading: boolean;
  pageIndex: number;
  pageSize: number;
  onCancel?: (id: number) => void;
  loadingText?: string;
  onPageChange: (page: number) => void;
  unauthorized?: boolean;
  isShowMore?: boolean;
  isCancel?: boolean;
  unauthorizedMessage?: string;
  noDataMessage?: string;
  globalError?: boolean;
}

const BasicTable = <T extends { id: number }>({
  columns,
  data,
  totalItems,
  isLoading,
  pageIndex,
  pageSize,
  onCancel,
  isCancel,
  loadingText,
  onPageChange,
  isShowMore,
  unauthorized,
  globalError,
}: BasicTableProps<T>) => {
  const { t } = useTranslation(["Tables"]);
  const tableInstance = useTable({
    columns,
    data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div>
      <div className="max-w-full overflow-x-auto border border-gray-200 dark:border-gray-200 m-0.5 rounded">
        <table {...getTableProps()} className="min-w-full">
          <thead className="border-b border-gray-100 dark:border-white/[0.05]">
            {headerGroups.map((headerGroup: any) => (
              <TableHeader key={headerGroup.id} headerGroup={headerGroup} />
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="divide-y divide-gray-100 dark:divide-white/[0.05]"
          >
            {rows.map((row: any, i: number) => {
              prepareRow(row);
              return (
                <TableRow
                  key={i}
                  row={row}
                  isShowMore={isShowMore}
                  onCancel={onCancel}
                  isCancel={isCancel}
                />
              );
            })}
          </tbody>
        </table>
        {isLoading && (
          <Loading className="dark:!text-gray-700" text={loadingText} />
        )}
        {!isLoading && unauthorized && (
          <div className="p-4 text-center text-shadow-yellow-500 font-semibold">
            {t("unAuthorized")}
          </div>
        )}
            {!isLoading && data.length === 0 && !globalError && (
              <div className="p-4 text-center text-gray-700">{t("noData")}</div>
            )}
        {!isLoading && globalError && (
          <div className="p-4 text-center text-red-500 font-semibold">
            {t("unExpectedError")}
          </div>
        )}
      </div>

      <Pagination
        canNextPage={pageIndex + 1 < totalPages}
        canPreviousPage={pageIndex > 0}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalItems}
        handlePageChange={onPageChange}
        pageCount={totalPages}
      />
    </div>
  );
};

export default BasicTable;
