import { useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

type Props = {
  rowData: any;
  onEdit: (id: number) => void;
};

const TableActions = ({ rowData, onEdit }: Props) => {
  const handleEdit = useCallback(() => {
    onEdit(rowData.id);
  }, []);

  return (
    <div className="flex gap-2 justify-between">
      <button
        onClick={handleEdit}
        className="text-blue-600 hover:text-blue-800 bg-gray-200 dark:bg-gray-700  rounded border dark:border-gray-600 p-2 flex items-center justify-center"
      >
        <FaEdit size={20} />
      </button>
    </div>
  );
};

export default TableActions;
