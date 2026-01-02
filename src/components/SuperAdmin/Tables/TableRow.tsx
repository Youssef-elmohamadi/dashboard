import React from "react";
import TableActions from "../Tables/TablesActions";
interface TableRowProps {
  row: any;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onShip?: (id: number) => void;
  onCancel?: (id: number) => void;
  onChangeStatus?: (id: number) => void;
  isCancel?: boolean;
  isChangeStatus?: boolean;
  isShipped?: boolean;
  isModalEdit?: boolean;
  actionsColumnId?: string;
  isShowMore?: boolean;
  invoice?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  row,
  onEdit,
  onDelete,
  onShip,
  onCancel,
  onChangeStatus,
  isCancel,
  isChangeStatus,
  isShipped,
  isModalEdit,
  actionsColumnId = "actions", // من الأفضل وضع قيمة افتراضية هنا
  isShowMore,
  invoice,
}) => {
  const rowData = row.original;

  const { key: rowKey, ...restOfRowProps } = row.getRowProps();

  return (
    <tr key={rowKey} {...restOfRowProps}>
      {row.cells.map((cell: any) => {
        const { key: cellKey, ...restOfCellProps } = cell.getCellProps();
        const isActionsColumn = cell.column.id === actionsColumnId;

        return (
          <td
            key={cellKey}
            {...restOfCellProps}
            className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-200 overflow-hidden truncate"
          >
            {isActionsColumn ? (
              <TableActions
                rowData={rowData}
                onEdit={onEdit}
                onDelete={onDelete}
                onShip={onShip}
                onCancel={onCancel}
                onChangeStatus={onChangeStatus}
                isCancel={isCancel}
                isChangeStatus={isChangeStatus}
                isShipped={isShipped}
                isModalEdit={isModalEdit}
                isShowMore={isShowMore}
                invoice={invoice}
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
