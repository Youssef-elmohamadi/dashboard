import Badge from "../../ui/badge/Badge";

type Props = {
  status: string;
};
const BrandStatus = ({ status }: Props) => {
  return (
    <div className="flex items-center gap-3">
      <Badge
        size="sm"
        color={
          status === "active" || status === "delivered"
            ? "success"
            : status === "inactive" ||
              status === "pending" ||
              status === "unpaid"
            ? "warning"
            : status === "shipped" || status === "paid"
            ? "info"
            : status === "canceled"
            ? "error"
            : status === "processing"
            ? "primary"
            : "info"
        }
      >
        {status}
      </Badge>
    </div>
  );
};

export default BrandStatus;
