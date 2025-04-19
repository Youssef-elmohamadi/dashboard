import { format } from "date-fns";
import BrandCell from "./BrandCell";
import BrandStatus from "./BrandStatus";

type BaseEntity = {
  id: number;
  created_at?: string;
};

// نوع الـ Role لو موجود
type Role = { name: string };

// Props لتكوين الأعمدة الديناميكية
interface ColumnBuilderOptions<T extends BaseEntity> {
  includeName?: boolean;
  includeBrandName?: boolean;
  includeImageAndNameCell?: boolean;
  includeImagesAndNameCell?: boolean;
  includeStatus?: boolean;
  includeEmail?: boolean;
  includeRoles?: boolean;
  includeCreatedAt?: boolean;
  includeUpdatedAt?: boolean;
  includeActions?: boolean;
  includeRoleName?: boolean;
  includeCommissionRate?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  customActionsRenderer?: (rowData: T) => React.ReactNode;
}

export const buildColumns = <T extends BaseEntity>(
  options: ColumnBuilderOptions<T>
): any[] => {
  const columns: any[] = [
    {
      Header: "ID",
      accessor: "id" as keyof T,
    },
  ];

  if (options.includeImagesAndNameCell) {
    columns.push({
      Header: "Brand",
      id: "name_and_image",
      Cell: ({ row }: any) => (
        <BrandCell name={row.original?.name} image={row.original?.images[0]} />
      ),
    });
  }
  if (options.includeImageAndNameCell) {
    columns.push({
      Header: "Brand",
      id: "name_and_image",
      Cell: ({ row }: any) => (
        <BrandCell name={row.original.name} image={row.original.image} />
      ),
    });
  }

  if (options.includeName) {
    columns.push({
      Header: "Name",
      id: "full_name",
      accessor: (row: any) => `${row.first_name} ${row.last_name}`,
    });
  }
  if (options.includeRoleName) {
    columns.push({
      Header: "Name",
      accessor: "name",
    });
  }

  if (options.includeStatus) {
    columns.push({
      Header: "Status",
      id: "status",
      Cell: ({ row }: any) => <BrandStatus status={row.original.status} />,
    });
  }

  if (options.includeEmail) {
    columns.push({
      Header: "Email",
      accessor: "email" as keyof T,
    });
  }
  if (options.includeCommissionRate) {
    columns.push({
      Header: "Commission Rate",
      accessor: "commission_rate" as keyof T,
    });
  }

  if (options.includeRoles) {
    columns.push({
      Header: "Role",
      accessor: "roles" as keyof T,
      Cell: ({ cell }: any) => {
        const roles = cell.value as Role[];
        return roles?.map((role) => role.name).join(", ");
      },
    });
  }

  if (options.includeCreatedAt) {
    columns.push({
      Header: "Created At",
      accessor: "created_at" as keyof T,
      Cell: ({ value }: any) => format(new Date(value), "dd/MM/yyyy"),
    });
  }
  if (options.includeUpdatedAt) {
    columns.push({
      Header: "Updated At",
      accessor: "updated_at" as keyof T,
      Cell: ({ value }: any) => format(new Date(value), "dd/MM/yyyy"),
    });
  }

  if (options.includeActions) {
    columns.push({
      Header: "Actions",
      id: "actions",
      Cell: ({ row }: any) =>
        options.customActionsRenderer
          ? options.customActionsRenderer(row.original)
          : null,
    });
  }

  return columns;
};
