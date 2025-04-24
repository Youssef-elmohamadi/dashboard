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
  includeFullName?: boolean;
  includeCommissionRate?: boolean;
  includePaymentMethod?: boolean;
  includeTotalPrice?: boolean;
  includePhone?: boolean;
  includeAddress?: boolean;
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
      Header: "Name",
      id: "name_and_image",
      Cell: ({ row }: any) => (
        <BrandCell
          name={row.original?.name}
          image={row.original?.images[0]?.image}
        />
      ),
    });
  }
  if (options.includeImageAndNameCell) {
    columns.push({
      Header: "Name",
      id: "name_and_image",
      Cell: ({ row }: any) => (
        <BrandCell name={row.original.name} image={row.original?.image||null} />
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
  if (options.includeFullName) {
    columns.push({
      Header: "Customer",
      accessor: (row: any) =>
        `${row.order.user.first_name} ${row.order.user.last_name}`,
      id: "customer_name",
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
  if (options.includePhone) {
    columns.push({
      Header: "Phone",
      accessor: (row: any) => row.order.location?.phone,
      id: "phone",
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

  {
    if (options.includeAddress) {
      columns.push({
        Header: "Address",
        id: "full_address",
        accessor: (row: any) =>
          `${row.order.location?.city}, ${row.order.location?.area}, ${row.order.location?.street}`,
      });
    }
  }

  if (options.includeTotalPrice) {
    columns.push({
      Header: "Total Amount",
      accessor: "total" as keyof T,
    });
  }
  if (options.includePaymentMethod) {
    columns.push({
      Header: "Payment Method",
      accessor: (row) => row.order.payment_method,
    });
  }

  return columns;
};
