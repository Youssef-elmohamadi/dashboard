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
  includeOrderEndUserStatus?: boolean;
  includeTotalPrice?: boolean;
  includePhone?: boolean;
  includeAddress?: boolean;
  includeOrderStatus?: boolean;
  includeShippedStatus?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  customActionsRenderer?: (rowData: T) => React.ReactNode;
}

export const buildOrderColumns = <T extends BaseEntity>(
  options: ColumnBuilderOptions<T>
): any[] => {
  const columns: any[] = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Order Date",
      accessor: "created_at",
      Cell: ({ value }: any) => format(new Date(value), "dd/MM/yyyy"),
    },
    {
      Header: "Total Amount",
      accessor: "total_amount",
      Cell: ({ value }: any) => `${value.toLocaleString()} EGP`,
    },
    {
      Header: "Shipping Status",
      accessor: "sub_orders",
      Cell: ({ value }) => {
        const shippingStatus = value?.[0]?.shipping_status;

        return shippingStatus ? (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              shippingStatus === "shipped"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {shippingStatus}
          </span>
        ) : (
          <span className="text-gray-400">N/A</span>
        );
      },
    },
    {
      Header: "Paid Status",
      id: "is_paid",
      Cell: ({ row }: any) =>
        row.original.is_paid ? (
          <span className="text-green-600 font-semibold">Paid</span>
        ) : (
          <span className="text-red-600 font-semibold">Unpaid</span>
        ),
    },
  ];

  // Add column for order status if includeOrderStatus is true
  if (options.includeOrderStatus) {
    columns.push({
      Header: "Order Status",
      accessor: "status",
      Cell: ({ value }: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "paid"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {value}
        </span>
      ),
    });
  }

  if (options.includeActions) {
    columns.push({
      Header: "Options",
      id: "actions",
      Cell: ({ row }: any) =>
        options.customActionsRenderer
          ? options.customActionsRenderer(row.original)
          : null,
    });
  }

  return columns;
};
