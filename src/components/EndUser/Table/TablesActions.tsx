import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineCloseCircle, AiOutlineMore } from "react-icons/ai";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import { Link } from "react-router-dom";

type Props = {
  rowData: any;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onMore?: (id: number) => void;
  onShip?: (id: number) => void;
  onCancel?: (id: number) => void;
  onRate?: (id: number) => void;
  isRate?: boolean;
  isModalEdit?: boolean;
  isShowMore?: boolean;
  isShipped?: boolean;
  isCancel?: boolean;
  editLabel?: string;
  deleteLabel?: string;
  moreLabel?: string;
  shipLabel?: string;
  cancelLabel?: string;
  editIcon?: React.ReactNode;
  deleteIcon?: React.ReactNode;
  moreIcon?: React.ReactNode;
  shippedIcon?: React.ReactNode;
  cancelIcon?: React.ReactNode;
};

const TableActions = ({
  rowData,
  onEdit,
  onDelete,
  onMore,
  onShip,
  onCancel,
  onRate,
  isModalEdit = false,
  isShowMore = false,
  isShipped = false,
  isCancel = false,
  isRate = false,
  editLabel = "Edit",
  deleteLabel = "Delete",
  moreLabel,
  shipLabel = "Ship",
  cancelLabel,
  editIcon = <FaEdit size={20} />,
  deleteIcon = <FaTrash size={20} />,
  moreIcon = <AiOutlineMore size={20} />,
  shippedIcon = <MdLocalShipping size={20} />,
  cancelIcon = <AiOutlineCloseCircle size={20} />,
}: Props) => {
  const handleDelete = useCallback(() => {
    onDelete?.(rowData.id);
  }, [onDelete, rowData.id]);

  const handleEdit = useCallback(() => {
    onEdit?.(rowData.id);
  }, [onEdit, rowData.id]);

  const handleMore = useCallback(() => {
    onMore?.(rowData.id);
  }, [onMore, rowData.id]);

  const handleShip = useCallback(() => {
    onShip?.(rowData.id);
  }, [onShip, rowData.id]);

  const handleCancel = useCallback(() => {
    onCancel?.(rowData.id);
  }, [onCancel, rowData.id]);
  const { t } = useTranslation(["EndUserOrderHistory"]);
  return (
    <div className="flex gap-2 justify-around">
      {isShowMore && (
        <Link
          to={`details/${rowData.id}`}
          className="text-blue-600 hover:text-blue-800 bg-gray-200  border-gray-200  p-2 flex items-center justify-center"
        >
          {moreIcon}
          <span className="ml-1">{t("tableActions.view")}</span>
        </Link>
      )}

      {isCancel && onCancel && (
        <button
          onClick={handleCancel}
          className="text-yellow-600 hover:text-yellow-800 bg-gray-200 rounded border border-gray-200  p-2 flex items-center justify-center"
        >
          {cancelIcon}
          <span className="ml-1">{t("tableActions.cancel")}</span>
        </button>
      )}
      {isRate && onRate && (
        <button
          onClick={handleCancel}
          className="text-yellow-600 hover:text-yellow-800 bg-gray-200  rounded border border-gray-200  p-2 flex items-center justify-center"
        >
          {cancelIcon}
          <span className="ml-1">{cancelLabel}</span>
        </button>
      )}
    </div>
  );
};

export default TableActions;
