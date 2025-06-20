import { useTable } from "react-table";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import Loading from "../../common/Loading";
import { useTranslation } from "react-i18next";
import { ID } from "../../../types/Common";
import { Brand } from "../../../types/Brands";

interface BasicTableProps<T> {
  columns: any;
  data: Brand[];
  totalItems: number;
  isLoading: boolean;
  pageIndex: number;
  pageSize: number;
  onDelete?: (id: ID) => void;
  onEdit?: (id: ID) => void;
  onShip?: (id: ID) => void;
  onCancel?: (id: ID) => void;
  loadingText?: string;
  onPageChange: (page: number) => void;
  unauthorized?: boolean;
  isShowMore?: boolean;
  isShipped?: boolean;
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
  onDelete,
  onEdit,
  onShip,
  onCancel,
  isCancel,
  isShipped,
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
      <div className="max-w-full overflow-x-auto border border-gray-100 dark:border-gray-700 m-0.5 rounded">
        <table {...getTableProps()} className="min-w-full">
          <thead className="border-b border-gray-100 dark:border-white/[0.05]">
            {headerGroups.map((headerGroup: any, i: number) => (
              <TableHeader key={i} headerGroup={headerGroup} />
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
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isShowMore={isShowMore}
                  onShip={onShip}
                  onCancel={onCancel}
                  isCancel={isCancel}
                  isShipped={isShipped}
                />
              );
            })}
          </tbody>
        </table>
        {isLoading && <Loading text={loadingText} />}
        {!isLoading && unauthorized && (
          <div className="p-4 text-center text-shadow-yellow-500 font-semibold">
            {t("unAuthorized")}
          </div>
        )}
        {!isLoading && data.length === 0 && !globalError && (
          <div className="p-4 text-center text-gray-500">{t("noData")}</div>
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
