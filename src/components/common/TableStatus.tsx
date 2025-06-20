import { useTranslation } from "react-i18next";
import Badge from "../ui/badge/Badge";

type Props = {
  status: string;
};
type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

const getStatusColor = (status: string): BadgeColor => {
  const statusColorMap: { [key: string]: BadgeColor } = {
    active: "success",
    delivered: "success",
    inactive: "warning",
    pending: "warning",
    unpaid: "warning",
    shipped: "info",
    paid: "info",
    cancelled: "error",
    processing: "primary",
  };

  return statusColorMap[status] || "info";
};

const TableStatus = ({ status }: Props) => {
  const { t } = useTranslation(["Status"]);
  return (
    <div className="flex items-center gap-3">
      <Badge size="sm" color={getStatusColor(status)}>
        {status === "active"
          ? t("active")
          : status === "inactive"
          ? t("inactive")
          : status === "delivered"
          ? t("delivered")
          : status === "shipped"
          ? t("shipped")
          : status === "paid"
          ? t("paid")
          : status === "cancelled"
          ? t("cancelled")
          : status === "processing"
          ? t("processing")
          : status === "pending"
          ? t("pending")
          : status === "unpaid"
          ? t("unpaid")
          : status}
      </Badge>
    </div>
  );
};

export default TableStatus;
