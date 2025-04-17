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
          status === "active"
            ? "success"
            : status === "inactive"
            ? "warning"
            : "error"
        }
      >
        {status}
      </Badge>
    </div>
  );
};

export default BrandStatus;
