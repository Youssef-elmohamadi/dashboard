import React from "react";
import TableActions from "../Tables/TablesActions";

interface TableRowProps {
  row: any;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  isModalEdit?: boolean; // ✅ جديد: لتحديد نوع الـ Edit
  actionsColumnId?: string;
  isShowMore?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  row,
  onEdit,
  onDelete,
  isModalEdit = false,
  actionsColumnId = "actions",
  isShowMore,
}) => {
  const rowData = row.original;

  return (
    <tr {...row.getRowProps()}>
      {row.cells.map((cell: any) => {
        const cellProps = cell.getCellProps();
        const isActionsColumn = cell.column.id === actionsColumnId;

        return (
          <td
            {...cellProps}
            className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-200"
          >
            {isActionsColumn ? (
              <TableActions
                rowData={rowData}
                onEdit={onEdit}
                onDelete={onDelete}
                isModalEdit={isModalEdit} // ✅ مرر القيمة هنا
                isShowMore={isShowMore}
              />
            ) : (
              cell.render("Cell")
            )}
          </td>
        );
      })}
    </tr>
  );
};

export default TableRow;
