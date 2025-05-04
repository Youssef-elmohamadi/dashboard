import { format } from "date-fns";
import BrandCell from "./BrandCell";
import BrandStatus from "./BrandStatus";

type BaseEntity = {
  id: number;
  created_at?: string;
};

type Role = { name: string };
interface ColumnBuilderOptions<T extends BaseEntity> {
  includeVendorName?: boolean;
  includeVendorEmail?: boolean;
  includeVendorPhone?: boolean;
  includeDateOfCreation?: boolean;
  includeActions?: boolean;
  includeCommissionRate?: boolean;
  includeStatus?: boolean;
  includeImagesAndNameCell?: boolean;
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
        <BrandCell name={row.original?.name} image={row.original?.image} />
      ),
    });
  }

  // if (options.includeName) {
  //   columns.push({
  //     Header: "Name",
  //     id: "full_name",
  //     accessor: (row: any) => `${row.first_name} ${row.last_name}`,
  //   });
  // }
  if (options.includeVendorName) {
    columns.push({
      Header: "Name",
      accessor: "name",
    });
  }
  // if (options.includeFullName) {
  //   columns.push({
  //     Header: "Customer",
  //     accessor: (row: any) =>
  //       `${row.order.user.first_name} ${row.order.user.last_name}`,
  //     id: "customer_name",
  //   });
  // }

  if (options.includeStatus) {
    columns.push({
      Header: "Status",
      id: "status",
      Cell: ({ row }: any) => <BrandStatus status={row.original.status} />,
    });
  }
  // if (options.includeOrderStatus) {
  //   columns.push({
  //     Header: "Order Status",
  //     id: "order_status",
  //     Cell: ({ row }: any) => (
  //       <BrandStatus status={row.original.order.status} />
  //     ),
  //   });
  // }

  // if (options.includeShippedStatus) {
  //   columns.push({
  //     Header: "Shipping Status",
  //     id: "shipping_status",
  //     Cell: ({ row }: any) => (
  //       <BrandStatus status={row.original.shipping_status} />
  //     ),
  //   });
  // }

  if (options.includeVendorEmail) {
    columns.push({
      Header: "Email",
      accessor: "email" as keyof T,
    });
  }
  if (options.includeVendorPhone) {
    columns.push({
      Header: "Phone",
      accessor: "phone",
    });
  }
  if (options.includeCommissionRate) {
    columns.push({
      Header: "Commission Rate",
      accessor: "commission_rate" as keyof T,
    });
  }

  // if (options.includeRoles) {
  //   columns.push({
  //     Header: "Role",
  //     accessor: "roles" as keyof T,
  //     Cell: ({ cell }: any) => {
  //       const roles = cell.value as Role[];
  //       return roles?.map((role) => role.name).join(", ");
  //     },
  //   });
  // }
  // if (options.includeTotalPrice) {
  //   columns.push({
  //     Header: "Total Amount",
  //     accessor: "total" as keyof T,
  //   });
  // }
  // if (options.includePaymentMethod) {
  //   columns.push({
  //     Header: "Payment Method",
  //     accessor: (row) => row.order.payment_method,
  //   });
  // }

  if (options.includeDateOfCreation) {
    columns.push({
      Header: "Date of Creation",
      accessor: "created_at" as keyof T,
      Cell: ({ value }: any) => format(new Date(value), "dd/MM/yyyy"),
    });
  }
  // if (options.includeUpdatedAt) {
  //   columns.push({
  //     Header: "Updated At",
  //     accessor: "updated_at" as keyof T,
  //     Cell: ({ value }: any) => format(new Date(value), "dd/MM/yyyy"),
  //   });
  // }

  // {
  //   if (options.includeAddress) {
  //     columns.push({
  //       Header: "Address",
  //       id: "full_address",
  //       accessor: (row: any) =>
  //         `${row.order.location?.city}, ${row.order.location?.area}, ${row.order.location?.street}`,
  //     });
  //   }
  // }

  // if (options.includeCode) {
  //   columns.push({
  //     Header: "Code",
  //     accessor: "code" as keyof T,
  //   });
  // }
  // if (options.includeType) {
  //   columns.push({
  //     Header: "Type",
  //     accessor: "type" as keyof T,
  //   });
  // }

  // if (options.includeValue) {
  //   columns.push({
  //     Header: "Value",
  //     accessor: "value" as keyof T,
  //   });
  // }

  // if (options.includeLimit) {
  //   columns.push({
  //     Header: "Usage Limit",
  //     accessor: "usage_limit" as keyof T,
  //   });
  // }

  // if (options.includeUsedCount) {
  //   columns.push({
  //     Header: "Used Count",
  //     accessor: "used_count" as keyof T,
  //   });
  // }

  // if (options.includeStartAt) {
  //   columns.push({
  //     Header: "Start Date",
  //     accessor: "start_at" as keyof T,
  //     Cell: ({ value }: any) => format(new Date(value), "dd/MM/yyyy"),
  //   });
  // }

  // if (options.includeExpiresAt) {
  //   columns.push({
  //     Header: "Expires At",
  //     accessor: "expires_at" as keyof T,
  //     Cell: ({ value }: any) => format(new Date(value), "dd/MM/yyyy"),
  //   });
  // }

  // if (options.includeIsActive) {
  //   columns.push({
  //     Header: "Active",
  //     accessor: "active" as keyof T,
  //     Cell: ({ value }: any) => (value ? "✅" : "❌"),
  //   });
  // }
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
