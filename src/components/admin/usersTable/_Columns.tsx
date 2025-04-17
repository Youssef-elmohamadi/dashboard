import { ColumnDef } from "react-table";
import TableActions from "./TableActions";
import { format } from "date-fns";

// هنا نقوم بتمرير الفانكشنز
export const Columns = (
  handleDelete: (id: number) => void
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
    accessor: "roles",
    Cell: ({ cell }: any) => {
      const roles = cell.value as { name: string }[];
      return roles?.map((role) => role.name).join(", ");
    },
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
        id={row.original.id}
        rowData={row.original}
        onDelete={(id) => handleDelete(id)}
      />
    ),
  },
];
