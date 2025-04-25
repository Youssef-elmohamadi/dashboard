const TableHeader = ({ headerGroup }: any) => (
  <tr
    {...headerGroup.getHeaderGroupProps()}
    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
  >
    {headerGroup.headers.map((column: any) => (
      <th
        {...column.getHeaderProps()}
        className="px-5 py-3 border-b border-gray-100 dark:border-white/[0.05]"
      >
        {column.render("Header")}
      </th>
    ))}
  </tr>
);
export default TableHeader;
