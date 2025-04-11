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

type User = {};
const UserTable = () => {
  const [data, setData] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await getAllAdmins();
        if (response?.data?.data) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    alertDelete(id, setData, data);
  };

  const handleEdit = (id: number) => {
    const user = data.find((user: any) => user.id === id);
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
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
  } = tableInstance;

  return (
    <div>
      <div className="max-w-full overflow-x-auto border dark:border-gray-700  m-0.5 rounded">
        <table {...getTableProps()} className="min-w-full ">
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
        {loading && <Loading text="Loading Admins data..." />}
      </div>
      <Pagination
        nextPage={nextPage}
        previousPage={previousPage}
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        pageIndex={state.pageIndex}
        pageSize={state.pageSize}
        totalCount={data.length}
      />
      {isModalOpen && selectedUser && (
        <UpdateAdmin
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          isModalOpen
        />
      )}
    </div>
  );
};

export default UserTable;
