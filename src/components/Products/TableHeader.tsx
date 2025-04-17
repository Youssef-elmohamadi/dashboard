const TableHeader = ({ headerGroup }: any) => (
  <tr className="hover:bg-transparent" {...headerGroup.getHeaderGroupProps()}>
    {headerGroup.headers.map((column: any) => (
      <th
        {...column.getHeaderProps()}
        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
      >
        {column.render("Header")}
      </th>
    ))}
  </tr>
);
export default TableHeader;
