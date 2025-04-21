import { useEffect, useMemo, useState } from "react";
import { useTable, usePagination } from "react-table";
import TableHeader from "./TableHeader";
//import TableRow from "../usersTable/TableRow";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import Loading from "../../common/Loading";

interface DataTableWrapperProps<T> {
  columns: any;
  fetchData: (pageIndex?: number, pageSize?: number) => Promise<any>;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  modalCreateComponent?: React.ReactNode;
  modalUpdateComponent?: React.ReactNode;
  manualPagination?: boolean;
  isModalEdit?: boolean;
  isShowMore?: boolean;
  dataKey?: string; // default "data"
  initialPagination?: {
    pageIndex: number;
    pageSize: number;
  };
  onDataUpdate?: (newData: T[]) => void;
  onPaginationChange?: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  trigger?: number;
  searchKey?: string;
  searchValueName?: string;
  searchValueEmail?: string;
  searchValuePhone?: string;
  searchValueCategoryId?: string;
  searchValueBrandId?: string;
  searchValueStatus?: string;
}

const BasicTable = <T extends { id: number }>({
  columns,
  fetchData,
  onEdit,
  onDelete,
  initialPagination = { pageIndex: 0, pageSize: 5 },
  onPaginationChange,
  modalUpdateComponent,
  modalCreateComponent,
  onDataUpdate,
  isModalEdit = false,
  trigger,
  isShowMore,
  searchValueName,
  searchValueEmail,
  searchValuePhone,
  searchValueStatus,
  searchValueCategoryId,
  searchValueBrandId,
}: DataTableWrapperProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);
  const [pageCount, setPageCount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [canNext, setCanNext] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [noData, setNoData] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setNoData(false);
      setUnauthorized(false);

      try {
        const res = await fetchData(pagination.pageIndex);
        const rows = res?.data || [];

        if (Array.isArray(rows) && rows.length === 0) {
          setNoData(true);
          setData(rows);
        } else {
          setData(rows);
        }

        const perPage = res?.perPage || 5;

        if (onDataUpdate) {
          onDataUpdate(rows);
        }

        setTotalItems(res.total);
        setPageCount(res?.last_page || 0);
        setCanNext(!!res?.next_page_url);
        setCanPrev(!!res?.prev_page_url);
        setPagination((prev) => ({ ...prev, pageSize: perPage }));
      } catch (err: any) {
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          setUnauthorized(true);
        } else {
          console.error("Fetching error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    trigger,
    searchValueName,
    searchValueEmail,
    searchValuePhone,
    searchValueCategoryId,
    searchValueBrandId,
    searchValueStatus,
  ]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pageCount) {
      const newPagination = { ...pagination, pageIndex: newPage };
      setPagination(newPagination);

      if (onPaginationChange) {
        onPaginationChange(newPagination);
      }
    }
  };

  const tableInstance = useTable(
    {
      columns: columns,
      data,
      manualPagination: true,
      pageCount,
    },
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    tableInstance;

  return (
    <div>
      <div className="max-w-full overflow-x-auto border dark:border-gray-700 m-0.5 rounded">
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
            {page.map((row: any, i: number) => {
              prepareRow(row);
              return (
                <TableRow
                  key={i}
                  row={row}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isModalEdit={isModalEdit}
                  isShowMore={isShowMore}
                />
              );
            })}
          </tbody>
        </table>
        {loading && <Loading text="Loading Brands Data..." />}
        {!loading && noData && (
          <div className="p-4 text-center text-gray-500">No Data Found</div>
        )}
        {!loading && unauthorized && (
          <div className="p-4 text-center text-red-500 font-semibold">
            Sorry, You Don't Have Permission
          </div>
        )}
      </div>

      <Pagination
        canNextPage={canNext}
        canPreviousPage={canPrev}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        totalItems={totalItems}
        handlePageChange={handlePageChange}
        pageCount={pageCount}
      />
      {modalUpdateComponent}
      {modalCreateComponent}
    </div>
  );
};

export default BasicTable;
