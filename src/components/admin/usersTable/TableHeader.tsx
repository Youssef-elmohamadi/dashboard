const TableHeader = ({ headerGroup }: any) => (
  <tr
    className="hover:bg-transparent text-center text-bold"
    {...headerGroup.getHeaderGroupProps()}
  >
    {headerGroup.headers.map((column: any) => (
      <th
        {...column.getHeaderProps()}
        className="px-5 py-3 text-gray-500 text-center bg-blue-600 font-bold text-theme-xs dark:text-white"
      >
        {column.render("Header")}
      </th>
    ))}
  </tr>
);
export default TableHeader;
