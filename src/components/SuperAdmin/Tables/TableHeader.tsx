const TableHeader = ({ headerGroup }: any) => {
  const { key: headerGroupKey, ...restOfHeaderGroupProps } =
    headerGroup.getHeaderGroupProps();

  return (
    <tr
      className="hover:bg-transparent text-center text-bold"
      key={headerGroupKey}
      {...restOfHeaderGroupProps}
    >
      {headerGroup.headers.map((column: any) => {
        const { key: columnKey, ...restOfColumnProps } =
          column.getHeaderProps();

        return (
          <th
            key={columnKey}
            {...restOfColumnProps}
            className="px-5 py-3 text-white text-center bg-brand-600 font-bold text-theme-xs dark:text-white"
          >
            {column.render("Header")}
          </th>
        );
      })}
    </tr>
  );
};

export default TableHeader;
