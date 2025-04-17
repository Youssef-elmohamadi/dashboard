import { useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";

type Props = {
  rowData: any;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onShow: (id: number) => void;
  isProduct?: boolean;
};

const TableActions = ({
  rowData,
  onEdit,
  onDelete,
  onShow,
  isProduct,
}: Props) => {
  const handleEdit = useCallback(() => {
    onEdit(rowData.id);
  }, []);
  console.log(rowData);

  const handleDelete = useCallback(() => {
    onDelete(rowData.id);
  }, []);
  const handleShowMore = useCallback(() => {
    onShow(rowData.id);
  }, []);

  console.log(isProduct);

  return (
    <div className="flex gap-2 justify-between">
      <button
        onClick={handleEdit}
        title="Edit Product"
        className="text-blue-600 hover:text-blue-800 bg-gray-200 dark:bg-gray-700  rounded border dark:border-gray-600 p-2 flex items-center justify-center"
      >
        <FaEdit size={20} />
      </button>
      {isProduct && (
        <button
          onClick={handleShowMore}
          title="Show More"
          className="text-green-600 hover:text-green-800 bg-gray-200 dark:bg-gray-700  rounded border dark:border-gray-600 p-2 flex items-center justify-center"
        >
          <TbListDetails size={20} />
        </button>
      )}
      <button
        onClick={handleDelete}
        title="Delete Product"
        className="text-red-600 hover:text-red-800  bg-gray-200 dark:bg-gray-700  rounded border dark:border-gray-600 p-2 flex items-center justify-center"
      >
        <FaTrash size={20} />
      </button>
    </div>
  );
};

export default TableActions;
