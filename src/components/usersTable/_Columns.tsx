import { ColumnDef } from "react-table";
import TableActions from "./TableActions";
import { format } from "date-fns";

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
    Header: "Name",
    id: "full_name",
    accessor: (row: any) => `${row.first_name} ${row.last_name}`,
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Created At",
    accessor: "created_at",
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
