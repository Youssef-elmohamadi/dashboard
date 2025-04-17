import { useTable, usePagination } from "react-table";
import { Columns } from "./_Columns";
import { useEffect, useMemo, useState } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Pagination from "./Pagination";
import { getAllProducts } from "../../api/products/_requests";
import UpdateProduct from "./UpdateProduct";
import ShowMore from "./ShowMore";
import Loading from "../common/Loading";
import { alertDelete } from "./Alert";
import "./alert.css";
type Category = {
  id: number;
  name: string;
  description: string;
};

type Brand = {
  id: number;
  name: string;
  status: string;
  image: string;
};

type Product = {
  id: number;
  vendor_id: number;
  name: string;
  slug: string;
  description: string | null;
  category_id: number;
  brand_id: number;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  status: string;
  is_featured: number;
  rating: number | null;
  views_count: number | null;
  created_at: string;
  updated_at: string;
  category: Category;
  brand: Brand;
  attributes: any[];
  images: string[];
  tags: string[];
  variants: any[];
};
const ProductsTable = () => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await getAllProducts();
      if (response?.data?.data) {
        setProductsData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  console.log(productsData);

  const handleDelete = async (id: number) => {
    const deleted = await alertDelete(id);
    if (deleted) {
      fetchData();
    }
  };

  const handleEdit = (id: number) => {
    const product = productsData.find((product: any) => product.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsEditModalOpen(true);
    }
  };

  const handleShowMore = (id: number) => {
    const product = productsData.find((product: any) => product.id === id);
    if (product) {
      setSelectedProduct(product);
      setIsShowModalOpen(true);
    }
  };
  const columns = useMemo(
    () => Columns(handleEdit, handleDelete, handleShowMore),
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data: productsData,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
  } = tableInstance;

  return (
    <div>
      <div className="max-w-full overflow-x-auto border dark:border-gray-700  m-0.5 rounded">
        <table {...getTableProps()} className="min-w-full ">
          <thead className="border-b border-gray-100 dark:border-white/[0.05]">
            {headerGroups.map((headerGroup: any) => (
              <TableHeader key={headerGroup.id} headerGroup={headerGroup} />
            ))}
          </thead>
          <tbody
            className="divide-y divide-gray-100 dark:divide-white/[0.05]"
            {...getTableBodyProps()}
          >
            {page.map((row: any, i: any) => {
              prepareRow(row);
              return (
                <TableRow
                  key={i}
                  row={row}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onShow={handleShowMore}
                />
              );
            })}
          </tbody>
        </table>
        {loading && <Loading text="loading data Roles..." />}
      </div>
      <Pagination
        nextPage={nextPage}
        previousPage={previousPage}
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        pageIndex={state.pageIndex}
        pageSize={state.pageSize}
        totalCount={productsData.length}
      />
      {isEditModalOpen && selectedProduct && (
        <UpdateProduct
          product={selectedProduct}
          onClose={() => setIsEditModalOpen(false)}
          isEditModalOpen
        />
      )}
      {isShowModalOpen && selectedProduct && (
        <ShowMore
          product={selectedProduct}
          onClose={() => setIsShowModalOpen(false)}
          isShowModalOpen
        />
      )}
    </div>
  );
};

export default ProductsTable;
