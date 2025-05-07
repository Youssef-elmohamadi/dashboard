import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../api/AdminApi/categoryApi/_requests";
import { useTranslation } from "react-i18next";

interface Order {
  productName: string;
  productCategory: string;
  productPrice: number | string;
  productStatus: string;
  productImage?: string;
}

export default function RecentOrders({ orders }: { orders: Order[] }) {
  const [categories, setCategories] = useState([]);
  const { t } = useTranslation(["RecentOrders"]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.data.original);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "delivered" || s === "shipped") return "success";
    if (s === "pending") return "warning";
    return "error";
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {t("recentOrders.title")}
        </h3>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            {t("recentOrders.filter")}
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            {t("recentOrders.seeAll")}
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("recentOrders.product")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("recentOrders.category")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("recentOrders.price")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("recentOrders.status")}
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.map((order, idx) => (
              <TableRow key={idx}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    {order.productImage ? (
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          className="h-[50px] w-[50px] object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-[50px] w-[50px] flex items-center justify-center rounded-md bg-gray-100 text-gray-400">
                        {t("recentOrders.na")}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.productName}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {categories.find((cat) => cat.id === order.productCategory)
                    ?.name || t("recentOrders.unknown")}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {typeof order.productPrice === "number"
                    ? `${order.productPrice} ${t("recentOrders.egp")}`
                    : order.productPrice}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color={getStatusColor(order.productStatus)}>
                    {t(
                      `recentOrders.statuses.${order.productStatus.toLowerCase()}`
                    )}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
