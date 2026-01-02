import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useTranslation } from "react-i18next";
interface Product {
  id: string;
  name: string;
  total_sold: number | string;
}

export default function TopSelligProducts({
  products,
}: {
  products: Product[];
}) {
  const { t } = useTranslation(["TopSellingTable"]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {t("title")}
        </h3>

        {/* <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            {t("seeAll")}
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            {t("filter")}
          </button>
        </div> */}
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 !text-center dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 !text-center text-theme-xs  font-medium text-gray-500 dark:text-gray-400"
              >
                {t("id")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 !text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("name")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 !text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("total")}
              </TableCell>
              {/* <TableCell
                isHeader
                className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Status
              </TableCell> */}
            </TableRow>
          </TableHeader>

<TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
  {products.length > 0 ? (
    products.map((product, idx) => (
      <TableRow key={idx}>
        <TableCell className="py-3 !text-center">
          <div className="flex justify-center items-center gap-3 text-gray-500">
            {product.id}
          </div>
        </TableCell>
        <TableCell className="py-3 text-gray-500 !text-center text-theme-sm dark:text-gray-400">
          {product.name}
        </TableCell>
        <TableCell className="py-3 text-gray-500 !text-center text-theme-sm dark:text-gray-400">
          {product.total_sold}
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <td colSpan={3} className="py-6 text-center text-gray-400 text-theme-sm">
        {t("noData", "لا توجد بيانات")}
      </td>
    </TableRow>
  )}
</TableBody>

        </Table>
      </div>
    </div>
  );
}
