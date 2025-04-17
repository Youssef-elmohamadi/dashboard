import { useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

type Props = {
  rowData: any;
  id: number;
  onDelete: (id: number) => void;
};

const TableActions = ({ rowData, id, onDelete }: Props) => {
  const handleDelete = useCallback(() => {
    onDelete(rowData.id);
  }, []);

  return (
    <div className="flex gap-2 justify-between">
      <Link
        to={`update/${id}`}
        className="text-blue-600 hover:text-blue-800 bg-gray-200 dark:bg-gray-700  rounded border dark:border-gray-600 p-2 flex items-center justify-center"
      >
        <FaEdit size={20} />
      </Link>
      <button
        onClick={handleDelete}
        className="text-red-600 hover:text-red-800  bg-gray-200 dark:bg-gray-700  rounded border dark:border-gray-600 p-2 flex items-center justify-center"
      >
        <FaTrash size={20} />
      </button>
    </div>
  );
};

export default TableActions;
