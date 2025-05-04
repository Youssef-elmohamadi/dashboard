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
  isModalEdit?: boolean; // ✅ جديد: لتحديد نوع الـ Edit
  actionsColumnId?: string;
  isShowMore?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  row,
  onEdit,
  onDelete,
  onChangeStatus,
  isShipped,
  isCancel,
  onShip,
  onCancel,
  isModalEdit = false,
  actionsColumnId = "actions",
  isChangeStatus,
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
                onCancel={onCancel}
                onShip={onShip}
                onChangeStatus={onChangeStatus}
                isCancel={isCancel}
                isShipped={isShipped}
                isModalEdit={isModalEdit}
                isShowMore={isShowMore}
                isChangeStatus={isChangeStatus}
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
