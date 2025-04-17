import { useTable, usePagination } from "react-table";
import { Columns } from "./_Columns";
import { useEffect, useMemo, useState } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import { getAllAdmins, deleteAdmin } from "../../api/usersApi/_requests";
import { alertDelete } from "./Alert";
import UpdateAdmin from "./UpdateAdmin";
import Loading from "../common/Loading";
import { getAllCategories, getCategoriesWithPaginate } from "../../api/categoryApi/_requests";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  vendor_id: number;
  avatar: string;
  created_at: string;
  updated_at: string;
  vendor: { id: number; name: string };
  roles: { id: number; name: string }[];
};

const CategoryTable = () => {
  const [data, setData] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 3,
  });
  const [canNext, setCanNext] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData([]);
      try {
        const response = await getCategoriesWithPaginate(
          pagination.pageIndex + 1
        );
        console.log(response.data.data.original.data);

        setPageCount(response.data.data.original.last_page || 0);
        setTotalItems(response.data.data.original.total || 0);
        setCanNext(!!response.data.data.original.next_page_url);
        setCanPrev(!!response.data.data.original.prev_page_url);

        const fetchedData = Array.isArray(response.data.data.original.data)
          ? response.data.data.original.data
          : [];
        setData(fetchedData);
      } catch (error: any) {
        console.error("Error fetching admins:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize]);

  console.log(data);

  const handleDelete = (id: number) => {
    alertDelete(id, setData, data);
  };
  console.log(data);

  const handleEdit = (id: number) => {
    const user = data.find((user) => user.id === id);
    if (user) {
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };

  const columns = useMemo(() => Columns(handleDelete, handleEdit), []);

  const tableInstance = useTable(
    {
      columns,
      data,
      manualPagination: true,
      pageCount,
    },
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
  } = tableInstance;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pageCount) {
      setPagination((prev) => ({ ...prev, pageIndex: newPage }));
      //gotoPage(newPage);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

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
            className="divide-y divide-gray-100 dark:divide-white/[0.05]"
            {...getTableBodyProps()}
          >
            {page.map((row: any, i: any) => {
              prepareRow(row);
              return (
                <TableRow
                  key={i}
                  row={row}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              );
            })}
          </tbody>
        </table>
        {loading && <Loading text="جارٍ تحميل بيانات المشرفين..." />}
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
      {isModalOpen && selectedUser && (
        <UpdateAdmin
          user={selectedUser}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          isModalOpen
        />
      )}
    </div>
  );
};

export default CategoryTable;
