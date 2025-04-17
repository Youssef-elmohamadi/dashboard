import { ColumnDef } from "react-table";
import TableActions from "./TableActions";
import { format } from "date-fns";
import BrandStatus from "../../admin/brandsTable/BrandStatus";

// هنا نقوم بتمرير الفانكشنز
export const Columns = (
  handleEdit: (id: number) => void,
  handleShowMore: (id: number) => void,
  handleDelete: (id: number) => void
): any[] => [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Category",
    id: "category",
    accessor: (row: any) => `${row?.category?.name ?? "_"}`,
  },
  {
    Header: "Brand",
    id: "brand",
    accessor: (row: any) => `${row?.brand?.name ?? "_"}`,
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock Quantity",
    accessor: "stock_quantity",
  },
  {
    Header: "Status",
    id: "status",
    Cell: ({ row }: any) => <BrandStatus status={row.original.status} />,
  },
  {
    Header: "Actions",
    id: "actions",
    Cell: ({ row }: { row: { original: any } }) => (
      <TableActions
        rowData={row.original}
        onDelete={(id) => handleDelete(id)}
        onEdit={(id) => handleEdit(id)}
        onShow={(id) => handleShowMore(id)}
        isProduct={true}
      />
    ),
  },
];
