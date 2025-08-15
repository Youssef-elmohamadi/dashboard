import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { useTranslation } from "react-i18next";
import { RecentOrdersProps } from "../../../types/DashboardHome";

export default function RecentOrders({ orders, userType }: RecentOrdersProps) {
  const { t } = useTranslation(["RecentOrders"]);

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "delivered" || s === "shipped") return "success";
    if (s === "pending" || s === "processing") return "warning";
    return "error";
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {t("recentOrders.title")}
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("recentOrders.orderId")}
              </TableCell>

              {/* {userType === "super_admin" && (
                <TableCell
                  isHeader
                  className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("recentOrders.vendor")}
                </TableCell>
              )} */}

              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("recentOrders.total")}
              </TableCell>

              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("recentOrders.orderStatus")}
              </TableCell>

              {userType === "admin" && (
                <TableCell
                  isHeader
                  className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("recentOrders.shippingStatus")}
                </TableCell>
              )}
              {userType === "admin" && (
                <TableCell
                  isHeader
                  className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("recentOrders.estimatedDate")}
                </TableCell>
              )}
              {userType === "super_admin" && (
                <TableCell
                  isHeader
                  className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("recentOrders.paymentMethod")}
                </TableCell>
              )}
              {userType === "super_admin" && (
                <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                  {t("recentOrders.location.fullName")}
                </TableCell>
              )}
              {userType === "super_admin" && (
                <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                  {t("recentOrders.location.phone")}
                </TableCell>
              )}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders?.map((order, idx) => (
              <TableRow key={idx}>
                <TableCell className="py-3 text-theme-sm text-gray-800 dark:text-white/90">
                  #{order.id}
                </TableCell>

                {/* {userType === "super_admin" && (
                  <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                  {order.vendor?.name || t("recentOrders.unknown")}
                  </TableCell>
                  )} */}

                <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                  {order.total || order.total_amount} {t("recentOrders.egp")}
                </TableCell>

                <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                  <Badge size="sm" color={getStatusColor(order.status)}>
                    {t(`recentOrders.statuses.${order.status?.toLowerCase()}`)}
                  </Badge>
                </TableCell>

                {userType === "admin" && (
                  <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                    <Badge
                      size="sm"
                      color={getStatusColor(order.shipping_status)}
                    >
                      {t(
                        `recentOrders.statuses.${order.shipping_status?.toLowerCase()}`
                      )}
                    </Badge>
                  </TableCell>
                )}
                {userType === "admin" && (
                  <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                    {order.estimated_delivery_date || order.delivered_at}
                  </TableCell>
                )}
                {userType === "super_admin" && (
                  <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                    {order.payment_method}
                  </TableCell>
                )}
                {userType === "super_admin" && (
                  <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                    {order.location.full_name}
                  </TableCell>
                )}
                {userType === "super_admin" && (
                  <TableCell className="py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                    {order.location.phone}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders?.length === 0 ? (
          <p className="py-6 text-center text-gray-500 dark:text-gray-400">
            {t("recentOrders.noData", "No recent orders available")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
