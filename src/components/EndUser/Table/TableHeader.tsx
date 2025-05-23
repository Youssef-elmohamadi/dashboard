const TableHeader = ({ headerGroup }: any) => (
  <tr
    {...headerGroup.getHeaderGroupProps()}
    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs "
  >
    {headerGroup.headers.map((column: any) => (
      <th
        {...column.getHeaderProps()}
        className="px-5 py-3 border-b border-gray-100 "
      >
        {column.render("Header")}
      </th>
    ))}
  </tr>
);
export default TableHeader;
