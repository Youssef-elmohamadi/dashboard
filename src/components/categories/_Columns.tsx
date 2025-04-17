import { ColumnDef } from "react-table";
import TableActions from "./TableActions";
import { format } from "date-fns";
import CategoryCell from "./CategoryCell";
import CategoryStatus from "./CtaegoryStatus";

// هنا نقوم بتمرير الفانكشنز
export const Columns = (
  handleDelete: (id: number) => void,
  handleEdit: (id: number) => void
): any[] => [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Category",
    id: "name_and_image",
    Cell: ({ row }: any) => (
      <CategoryCell name={row.original.name} image={row.original.image} />
    ),
  },
  {
    Header: "Description",
    accessor: "description",
  },
  {
    Header: "Status",
    id: "status",
    Cell: ({ row }: any) => <CategoryStatus status={row.original.status} />,
  },

  {
    Header: "Commission Rate",
    accessor: "commission_rate",
  },
  {
    Header: "Actions",
    id: "actions",
    Cell: ({ row }: { row: { original: any } }) => (
      <TableActions
        rowData={row.original}
        onDelete={(id) => handleDelete(id)}
        onEdit={(id) => handleEdit(id)}
      />
    ),
  },
];
