import { useCallback } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

type Props = {
  rowData: any;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onMore?: (id: number) => void;
  isModalEdit?: boolean;
  isShowMore?: boolean;
  editLabel?: string;
  deleteLabel?: string;
  moreLabel?: string;
  editIcon?: React.ReactNode;
  deleteIcon?: React.ReactNode;
  moreIcon?: React.ReactNode;
};

const TableActions = ({
  rowData,
  onEdit,
  onDelete,
  onMore,
  isModalEdit = false,
  isShowMore = false,
  editLabel = "Edit",
  deleteLabel = "Delete",
  moreLabel = "Show",
  editIcon = <FaEdit size={20} />,
  deleteIcon = <FaTrash size={20} />,
  moreIcon = <FaEye size={20} />,
}: Props) => {
  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(rowData.id);
    }
  }, [onDelete, rowData.id]);

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(rowData.id);
    }
  }, [onEdit, rowData.id]);

  const handleMore = useCallback(() => {
    if (onMore) {
      onMore(rowData.id);
    }
  }, [onMore, rowData.id]);

  return (
    <div className="flex gap-2 justify-between">
      {onEdit && (
        <div>
          {isModalEdit ? (
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800 bg-gray-200 dark:bg-gray-700 rounded border dark:border-gray-600 p-2 flex items-center justify-center"
            >
              {editIcon}
              <span className="ml-1">{editLabel}</span>
            </button>
          ) : (
            <Link
              to={`update/${rowData.id}`}
              className="text-blue-600 hover:text-blue-800 bg-gray-200 dark:bg-gray-700 rounded border dark:border-gray-600 p-2 flex items-center justify-center"
            >
              {editIcon}
              <span className="ml-1">{editLabel}</span>
            </Link>
          )}
        </div>
      )}

      {onMore && (
        <button
          onClick={handleMore}
          className="text-green-600 hover:text-green-800 bg-gray-200 dark:bg-gray-700 rounded border dark:border-gray-600 p-2 flex items-center justify-center"
        >
          {moreIcon}
          <span className="ml-1">{moreLabel}</span>
        </button>
      )}

      {isShowMore && (
        <Link
          to={`details/${rowData.id}`}
          className="text-green-600 hover:text-green-800 bg-gray-200 dark:bg-gray-700 rounded border dark:border-gray-600 p-2 flex items-center justify-center"
        >
          {editIcon}
          <span className="ml-1">{moreLabel}</span>
        </Link>
      )}
      {onDelete && (
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 bg-gray-200 dark:bg-gray-700 rounded border dark:border-gray-600 p-2 flex items-center justify-center"
        >
          {deleteIcon}
          <span className="ml-1">{deleteLabel}</span>
        </button>
      )}
    </div>
  );
};

export default TableActions;
