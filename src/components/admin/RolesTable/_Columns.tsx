import { ColumnDef } from "react-table";
import TableActions from "./TableActions";
import { format } from "date-fns";

// هنا نقوم بتمرير الفانكشنز
export const Columns = (
  handleEdit: (id: number) => void,
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
    Header: "Created At",
    accessor: "created_at",
    Cell: ({ value }: any) => {
      return format(new Date(value), "dd/MM/yyyy");
    },
  },
  {
    Header: "Updated At",
    accessor: "updated_at",
    Cell: ({ value }: any) => {
      return format(new Date(value), "dd/MM/yyyy");
    },
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
