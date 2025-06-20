import { format } from "date-fns";
import BrandCell from "./BrandCell";
import TableStatus from "../../common/TableStatus";

type BaseEntity = {
  id: number;
  created_at?: string;
};

type Role = { name: string };
interface ColumnBuilderOptions<T extends BaseEntity> {
  includeName?: boolean;
  includeEmail?: boolean;
  includeRoles?: boolean;
  includeBrandName?: boolean;
  includeImageAndNameCell?: boolean;
  includeImagesAndNameCell?: boolean;
  includeStatus?: boolean;
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
  includeOrderStatus?: boolean;
  includeShippedStatus?: boolean;
  includeCode?: boolean;
  includeType?: boolean;
  includeValue?: boolean;
  includeLimit?: boolean;
  includeUsedCount?: boolean;
  includeStartAt?: boolean;
  includeExpiresAt?: boolean;
  includeIsActive?: boolean;

  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  customActionsRenderer?: (rowData: T) => React.ReactNode;
}
import { useTranslation } from "react-i18next";
export const buildColumns = <T extends BaseEntity>(
  options: ColumnBuilderOptions<T>
): any[] => {
  const { t } = useTranslation(["ColmunsAdmin"]);
  const columns: any[] = [
    {
      Header: t("table.id"),
      accessor: "id" as keyof T,
    },
  ];

  if (options.includeImagesAndNameCell) {
    columns.push({
      Header: t("table.name"),
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
      Header: t("table.name"),
      id: "name_and_image",
      Cell: ({ row }: any) => (
        <BrandCell
          name={row.original.name}
          image={row.original?.image || null}
        />
      ),
    });
  }

  if (options.includeName) {
    columns.push({
      Header: t("table.name"),
      id: "full_name",
      accessor: (row: any) => `${row?.first_name} ${row?.last_name}`,
    });
  }
  if (options.includeRoleName) {
    columns.push({
      Header: t("table.name"),
      accessor: "name",
    });
  }
  if (options.includeFullName) {
    columns.push({
      Header: t("table.customer"),
      accessor: (row: any) =>
        `${row.order?.user?.first_name} ${row.order?.user?.last_name}`,
      id: "customer_name",
    });
  }

  if (options.includeStatus) {
    columns.push({
      Header: t("table.status"),
      id: "status",
      Cell: ({ row }: any) => <TableStatus status={row.original?.status} />,
    });
  }
  if (options.includeOrderStatus) {
    columns.push({
      Header: t("table.order_status"),
      id: "order_status",
      Cell: ({ row }: any) => (
        <TableStatus status={row.original?.order?.status} />
      ),
    });
  }

  if (options.includeShippedStatus) {
    columns.push({
      Header: t("table.shipping_status"),
      id: "shipping_status",
      Cell: ({ row }: any) => (
        <TableStatus status={row.original?.shipping_status} />
      ),
    });
  }

  if (options.includeEmail) {
    columns.push({
      Header: t("table.email"),
      accessor: "email" as keyof T,
    });
  }
  if (options.includePhone) {
    columns.push({
      Header: t("table.phone"),
      accessor: (row: any) => row.order.location?.phone,
      id: "phone",
    });
  }
  if (options.includeCommissionRate) {
    columns.push({
      Header: t("table.commission_rate"),
      accessor: "commission_rate" as keyof T,
    });
  }

  if (options.includeRoles) {
    columns.push({
      Header: t("table.role"),
      accessor: "roles" as keyof T,
      Cell: ({ cell }: any) => {
        const roles = cell.value as Role[];
        return roles?.map((role) => role?.name).join(", ");
      },
    });
  }
  if (options.includeTotalPrice) {
    columns.push({
      Header: t("table.total_amount"),
      accessor: "total" as keyof T,
    });
  }
  if (options.includePaymentMethod) {
    columns.push({
      Header: t("table.payment_method"),
      accessor: (row: any) => row.order?.payment_method,
    });
  }

  if (options.includeCreatedAt) {
    columns.push({
      Header: t("table.created_at"),
      accessor: "created_at" as keyof T,
      //Cell: ({ value }: any) => format(new Date(value), "dd/MM/yyyy"),
      Cell: ({ value }: any) => {
        if (!value) return ""; // أو عرض رسالة بديلة مثلاً "-"
        const date = new Date(value);
        if (isNaN(date.getTime())) return ""; // إذا التاريخ غير صالح
        return format(date, "dd/MM/yyyy");
      },
    });
  }
  if (options.includeUpdatedAt) {
    columns.push({
      Header: t("table.updated_at"),
      accessor: "updated_at" as keyof T,
      Cell: ({ value }: any) => format(new Date(value), "dd/MM/yyyy"),
    });
  }

  {
    if (options.includeAddress) {
      columns.push({
        Header: t("table.address"),
        id: "full_address",
        accessor: (row: any) =>
          `${row.order?.location?.city}, ${row.order?.location?.area}, ${row.order?.location?.street}`,
      });
    }
  }

  if (options.includeCode) {
    columns.push({
      Header: t("table.code"),
      accessor: "code" as keyof T,
    });
  }
  if (options.includeType) {
    columns.push({
      Header: t("table.type"),
      accessor: "type" as keyof T,
    });
  }

  if (options.includeValue) {
    columns.push({
      Header: t("table.value"),
      accessor: "value" as keyof T,
    });
  }

  if (options.includeLimit) {
    columns.push({
      Header: t("table.usage_limit"),
      accessor: "usage_limit" as keyof T,
    });
  }

  if (options.includeUsedCount) {
    columns.push({
      Header: t("table.used_count"),
      accessor: "used_count" as keyof T,
    });
  }

  if (options.includeStartAt) {
    columns.push({
      Header: t("table.start_date"),
      accessor: "start_at" as keyof T,
      Cell: ({ value }: any) => format(new Date(value), "dd/MM/yyyy"),
    });
  }

  if (options.includeExpiresAt) {
    columns.push({
      Header: t("table.expires_at"),
      accessor: "expires_at" as keyof T,
      Cell: ({ value }: any) => format(new Date(value), "dd/MM/yyyy"),
    });
  }

  if (options.includeIsActive) {
    columns.push({
      Header: t("table.active"),
      accessor: "active" as keyof T,
      Cell: ({ value }: any) => (value ? "✅" : "❌"),
    });
  }
  if (options.includeActions) {
    columns.push({
      Header: t("table.actions"),
      id: "actions",
      Cell: ({ row }: any) =>
        options.customActionsRenderer
          ? options.customActionsRenderer(row?.original)
          : null,
    });
  }

  return columns;
};
