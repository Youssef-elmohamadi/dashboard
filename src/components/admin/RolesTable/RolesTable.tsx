import { useTable, usePagination } from "react-table";
import { Columns } from "./_Columns";
import { useEffect, useMemo, useState } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import { getAllRoles } from "../../../api/rolesApi/_requests";
import UpdateRole from "./UpdateRole";
import Loading from "../../common/Loading";
import { alertDelete } from "./Alert";
import "./alert.css";
import CreateRole from "./CreateRole";

type Role = {};
const RolesTable = ({ isModalOpenCreate, setIsModalOpenCreate }: any) => {
  const [rolesData, setRolesData] = useState<Role[]>([]);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllRoles();
      if (response?.data?.data) {
        setRolesData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  console.log(rolesData);

  const handleDelete = (id: number) => {
    alertDelete(id, setRolesData, rolesData);
  };

  const handleEdit = (id: number) => {
    const role = rolesData.find((role: any) => role.id === id);
    if (role) {
      setSelectedRole(role);
      setIsModalOpenEdit(true);
    }
  };
  const columns = useMemo(() => Columns(handleEdit, handleDelete), []);

  const tableInstance = useTable(
    {
      columns,
      data: rolesData,
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
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              );
            })}
          </tbody>
        </table>
        {loading && <Loading text="loading data Roles..." />}
      </div>
      <Pagination
        nextPage={nextPage}
        previousPage={previousPage}
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        pageIndex={state.pageIndex}
        pageSize={state.pageSize}
        totalCount={rolesData.length}
      />
      {isModalOpenEdit && selectedRole && (
        <UpdateRole
          role={selectedRole}
          onClose={() => setIsModalOpenEdit(false)}
          isModalOpen
        />
      )}
      {isModalOpenCreate && (
        <CreateRole
          onClose={() => setIsModalOpenCreate(false)}
          isModalOpen={isModalOpenCreate}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default RolesTable;
