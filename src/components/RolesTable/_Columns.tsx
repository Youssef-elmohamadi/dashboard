import { ColumnDef } from "react-table";
import { format } from "date-fns";
import TableActions from "./TableActions";

// هنا نقوم بتمرير الفانكشنز
export const Columns = (
  handleEdit: (id: number) => void
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
        onEdit={(id) => handleEdit(id)}
      />
    ),
  },
];
