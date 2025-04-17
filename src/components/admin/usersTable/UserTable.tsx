import { useTable, usePagination } from "react-table";
import { Columns } from "./_Columns";
import { useEffect, useMemo, useState } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import { getAllAdmins, deleteAdmin } from "../../../api/usersApi/_requests";
import { alertDelete } from "./Alert";
import UpdateAdmin from "./UpdateAdmin";
import Loading from "../../common/Loading";
import { useLocation } from "react-router-dom";
import { use } from "i18next";
import Alert from "../../ui/alert/Alert";

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

const UserTable = () => {
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
  const [successCreate, setSuccessCreate] = useState<"" | null>();
  const [successUpdate, setSuccessUpdate] = useState<"" | null>();
  const location = useLocation();
  useEffect(() => {
    if (location.state?.successCreate) {
      setSuccessCreate(location.state.successCreate);

      setTimeout(() => setSuccessCreate(null), 3000);
    }
  }, [location.state]);
  useEffect(() => {
    if (location.state?.successUpdate) {
      setSuccessUpdate(location.state.successUpdate);

      setTimeout(() => setSuccessUpdate(null), 3000);
    }
  }, [location.state]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData([]);
      try {
        const response = await getAllAdmins(
          pagination.pageIndex + 1,
          pagination.pageSize
        );
        console.log(response.data.data);

        setPageCount(response.data.data.last_page || 0);
        setTotalItems(response.data.data.total || 0);
        setCanNext(!!response.data.data.next_page_url);
        setCanPrev(!!response.data.data.prev_page_url);

        const fetchedData = Array.isArray(response.data.data)
          ? response.data.data
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

  const handleDelete = (id: number) => {
    alertDelete(id, setData, data);
  };

  const columns = useMemo(() => Columns(handleDelete), []);

  const tableInstance = useTable(
    {
      columns,
      data,
      manualPagination: true,
      pageCount,
    },
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    tableInstance;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pageCount) {
      setPagination((prev) => ({ ...prev, pageIndex: newPage }));
    }
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div>
      {successCreate && (
        <Alert
          variant="success"
          title="Create Admin"
          message="Your Create Successfuly"
        />
      )}
      {successUpdate && (
        <Alert
          variant="success"
          title="Update Admin"
          message="Your Update Successfuly"
        />
      )}
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
              return <TableRow key={i} row={row} onDelete={handleDelete} />;
            })}
          </tbody>
        </table>
        {loading && <Loading text="loading Admins Data" />}
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

export default UserTable;
