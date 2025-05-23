import { useCallback } from "react";
import { AiOutlineCloseCircle, AiOutlineMore } from "react-icons/ai";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Props = {
  rowData: any;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onMore?: (id: number) => void;
  onShip?: (id: number) => void;
  onCancel?: (id: number) => void;
  onChangeStatus?: (id: number) => void;
  isModalEdit?: boolean;
  isShowMore?: boolean;
  isShipped?: boolean;
  isCancel?: boolean;
  isChangeStatus?: boolean;
  editLabel?: string;
  deleteLabel?: string;
  moreLabel?: string;
  shipLabel?: string;
  cancelLabel?: string;
  changeStatusLabel?: string;
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
  onChangeStatus,
  isModalEdit = false,
  isShowMore = false,
  isShipped = false,
  isCancel = false,
  isChangeStatus = false,
  editLabel = "Edit",
  deleteLabel = "Delete",
  moreLabel = "Show",
  shipLabel = "Ship",
  cancelLabel = "Cancel",
  changeStatusLabel = "Change Status",
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
  const handleChangeStatus = useCallback(() => {
    onChangeStatus?.(rowData.id);
  }, [onChangeStatus, rowData.id]);
  const { t } = useTranslation(["AdminsTablesActions"]);
  return (
    <div className="flex gap-2 justify-around">
      {onEdit && (
        <div>
          {isModalEdit ? (
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800 bg-gray-200 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 p-2 flex items-center justify-center"
            >
              {editIcon}
              <span className="ml-1">{t("edit_label")}</span>
            </button>
          ) : (
            <Link
              to={`update/${rowData.id}`}
              className="text-blue-600 hover:text-blue-800 bg-gray-200 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 p-2 flex items-center justify-center"
            >
              {editIcon}
              <span className="ml-1">{t("edit_label")}</span>
            </Link>
          )}
        </div>
      )}

      {onMore && (
        <button
          onClick={handleMore}
          className="text-green-600 hover:text-green-800 bg-gray-200 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 p-2 flex items-center justify-center"
        >
          {moreIcon}
          <span className="ml-1">{t("more_label")}</span>
        </button>
      )}

      {isShowMore && (
        <Link
          to={`details/${rowData.id}`}
          className="text-blue-600 hover:text-blue-800 bg-gray-200 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 p-2 flex items-center justify-center"
        >
          {moreIcon}
          <span className="ml-1">{t("more_label")}</span>
        </Link>
      )}

      {onDelete && (
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 bg-gray-200 dark:bg-gray-700 rounded border dark:border-gray-600 p-2 flex items-center justify-center"
        >
          {deleteIcon}
          <span className="ml-1">{t("delete_label")}</span>
        </button>
      )}

      {isShipped && onShip && (
        <button
          onClick={handleShip}
          className="text-green-600 hover:text-green-800 bg-gray-200 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 p-2 flex items-center justify-center"
        >
          {shippedIcon}
          <span className="ml-1">{t("ship_label")}</span>
        </button>
      )}

      {isCancel && onCancel && (
        <button
          onClick={handleCancel}
          className="text-yellow-600 hover:text-yellow-800 bg-gray-200 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 p-2 flex items-center justify-center"
        >
          {cancelIcon}
          <span className="ml-1">{t("cancel_label")}</span>
        </button>
      )}
      {isChangeStatus && onChangeStatus && (
        <button
          onClick={handleChangeStatus}
          className="text-yellow-600 hover:text-yellow-800 bg-gray-200 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 p-2 flex items-center justify-center"
        >
          {cancelIcon}
          <span className="ml-1">{t("change_status_label")}</span>
        </button>
      )}
    </div>
  );
};

export default TableActions;
