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
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  onShip?: (id: number) => void;
  onCancel?: (id: number) => void;
  onChangeStatus?: (id: number) => void;
  loadingText?: string;
  onPageChange: (page: number) => void;
  unauthorized?: boolean;
  globalError?: boolean;
  isShowMore?: boolean;
  isShipped?: boolean;
  isCancel?: boolean;
  isChangeStatus?: boolean;
  unauthorizedMessage?: string;
  noDataMessage?: string;
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
  isChangeStatus,
  loadingText,
  onPageChange,
  onChangeStatus,
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
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onChangeStatus={onChangeStatus}
                  isChangeStatus={isChangeStatus}
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
        {!isLoading && globalError && (
          <div className="p-4 text-center text-red-500 font-semibold">
            {t("unExpectedError")}
          </div>
        )}
        {!isLoading && data.length === 0 && (
          <div className="p-4 text-center text-gray-500">{t("")}</div>
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
