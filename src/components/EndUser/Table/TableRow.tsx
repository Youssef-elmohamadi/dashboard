import React from "react";
import TableActions from "./TablesActions";

interface TableRowProps {
  row: any;
  onCancel?: (id: number) => void;
  isCancel?: boolean;
  actionsColumnId?: string;
  isShowMore?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  row,
  isCancel,
  onCancel,
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
            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs"
          >
            {isActionsColumn ? (
              <TableActions
                rowData={rowData}
                onCancel={onCancel}
                isCancel={isCancel}
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
