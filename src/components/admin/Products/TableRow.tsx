import TableActions from "./TableActions";
// import { User } from "./_Columns"; // تأكد من استيراد `User` لتعريف البيانات

const TableRow = ({ row, onDelete, onEdit, onShow }: any) => {
  const rowData = row.original;

  return (
    <tr {...row.getRowProps()}>
      {row.cells.map((cell: any) => (
        <td
          {...cell.getCellProps()}
          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
        >
          {cell.column.id === "actions" ? (
            <TableActions
              rowData={rowData}
              onEdit={onEdit}
              onDelete={onDelete}
              isProduct={true}
              onShow={onShow}
            />
          ) : (
            cell.render("Cell")
          )}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
