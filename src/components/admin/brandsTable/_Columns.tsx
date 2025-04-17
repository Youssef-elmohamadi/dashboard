import { format } from "date-fns";
import TableActions from "./TableActions";
import BrandCell from "./BrandCell";
import BrandStatus from "./BrandStatus";
export const Columns = (
  handleDelete: (id: number) => void,
  handleEdit: (id: number) => void
): any[] => [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Brand",
    id: "name_and_image",
    Cell: ({ row }: any) => (
      <BrandCell name={row.original.name} image={row.original.image} />
    ),
  },

  {
    Header: "Status",
    id: "status",
    Cell: ({ row }: any) => <BrandStatus status={row.original.status} />,
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
        onDelete={(id) => handleDelete(id)}
      />
    ),
  },
];
