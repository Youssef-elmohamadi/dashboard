import { useTranslation } from "react-i18next";
import Badge from "../../ui/badge/Badge";

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
    unpaid: "warning",
    shipped: "info",
    paid: "info",
    cancelled: "error",
    processing: "info",
    pending: "warning", 
    reviewed: "info", 
    responded: "success",
    closed: "dark", 
  };
  return statusColorMap[status.toLowerCase()] || "info";
};

const TableStatus = ({ status }: Props) => {
  const { t } = useTranslation(["Status"]);
  const translatedStatus = t(status.toLowerCase(), { defaultValue: status });

  return (
    <div className="flex items-center gap-3">
      <Badge size="sm" color={getStatusColor(status)}>
        {translatedStatus}
      </Badge>
    </div>
  );
};

export default TableStatus;
