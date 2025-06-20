import React from "react";
import TableActions from "../Tables/TablesActions";
import { ID } from "../../../types/Common";

interface TableRowProps {
  row: any;
  onEdit?: (id: ID) => void;
  onDelete?: (id: ID) => void;
  onShip?: (id: ID) => void;
  onCancel?: (id: ID) => void;
  isCancel?: boolean;
  isShipped?: boolean;
  isModalEdit?: boolean;
  actionsColumnId?: string;
  isShowMore?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  row,
  onEdit,
  onDelete,
  onShip,
  onCancel,
  isCancel,
  isShipped,
  isModalEdit = false,
  actionsColumnId = "actions",
  isShowMore,
}) => {
  const rowData = row.original;

  // 1. فصل الـ key عن باقي خصائص الصف
  const { key: rowKey, ...restOfRowProps } = row.getRowProps();

  return (
    // 2. تطبيق الـ key وباقي الخصائص بشكل صحيح
    <tr key={rowKey} {...restOfRowProps}>
      {row.cells.map((cell: any) => {
        // 3. فصل الـ key عن باقي خصائص الخلية
        const { key: cellKey, ...restOfCellProps } = cell.getCellProps();
        const isActionsColumn = cell.column.id === actionsColumnId;

        return (
          // 4. تطبيق الـ key وباقي الخصائص بشكل صحيح
          <td
            key={cellKey}
            {...restOfCellProps}
            className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-200"
          >
            {isActionsColumn ? (
              <TableActions
                rowData={rowData}
                onEdit={onEdit}
                onDelete={onDelete}
                onCancel={onCancel}
                onShip={onShip}
                isCancel={isCancel}
                isShipped={isShipped}
                isShowMore={isShowMore}
                isModalEdit={isModalEdit}
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
