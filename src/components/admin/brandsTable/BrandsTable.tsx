import { useTable, usePagination } from "react-table";
import { Columns } from "./_Columns";
import { useEffect, useMemo, useState } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import { getAllBrands } from "../../../api/brandsApi/_requests";
import UpdateBrand from "./UpdateBrand";
import Loading from "../../common/Loading";
import { alertDelete } from "./Alert";

type Role = {};
const brandsTable = () => {
  const [brandsData, setBrandsData] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getAllBrands();
        if (response?.data?.data) {
          setBrandsData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching Brands:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    const Brand = brandsData.find((role: any) => role.id === id);
    if (Brand) {
      setSelectedBrand(Brand);
      setIsModalOpen(true);
    }
  };
  const handleDelete = (id: number) => {
    alertDelete(id, setBrandsData, brandsData);
  };
  const columns = useMemo(() => Columns(handleEdit, handleDelete), []);
  console.log(selectedBrand);

  const tableInstance = useTable(
    {
      columns,
      data: brandsData,
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
        totalCount={brandsData.length}
      />
      {isModalOpen && selectedBrand && (
        <UpdateBrand
          brand={selectedBrand}
          onClose={() => setIsModalOpen(false)}
          isModalOpen
        />
      )}
    </div>
  );
};

export default brandsTable;
