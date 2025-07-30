import { useEffect, useState } from "react";
// import PageMeta from "../../../components/common/SEO/PageMeta"; // This was already commented out, good.
import SEO from "../../../components/common/SEO/seo"; // Imported SEO component
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import BasicTable from "../../../components/admin/Tables/BasicTableTS";
import { useLocation } from "react-router";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
import Alert from "../../../components/ui/alert/Alert";
import {
  useAllProducts,
  useDeleteProduct,
} from "../../../hooks/Api/Admin/useProducts/useAdminProducts";
import { useAllCategories } from "../../../hooks/Api/Admin/useCategories/useCategories";
import { useAllBrands } from "../../../hooks/Api/Admin/useBrands/useBrands";
import { AxiosError } from "axios";
import { ID, TableAlert } from "../../../types/Common";
import { SearchValues } from "../../../types/Product";
import { Brand } from "../../../types/Brands";
import { Category } from "../../../types/Categories";

const Products = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [searchValues, setSearchValues] = useState<SearchValues>({
    category_id: "",
    brand_id: "",
    status: "",
    name: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["ProductsTable", "Meta"]); // استخدام الـ namespaces هنا
  const {
    data: products,
    isLoading,
    isError,
    refetch,
    error,
  } = useAllProducts(pageIndex, searchValues);
  console.log("Products data:", products);

  const pageSize = products?.per_page ?? 15;
  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setUnauthorized(true);
      } else if (status === 500) {
        setGlobalError(true);
      } else {
        setGlobalError(true);
      }
    }
  }, [isError, error]);
  const productsData = products?.data ?? [];
  const totalProducts = products?.total ?? 0;
  const [alertData, setAlertData] = useState<TableAlert | null>(null);
  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("ProductsTable:productsPage.createdSuccessTitle"), // إضافة namespace
        message: t("ProductsTable:productsPage.createdSuccessMessage", {
          message: location.state.successCreate,
        }), // إضافة namespace
      });
      window.history.replaceState({}, document.title);
    } else if (location.state?.successEdit) {
      setAlertData({
        variant: "success",
        title: t("ProductsTable:productsPage.updatedSuccessTitle"), // إضافة namespace
        message: t("ProductsTable:productsPage.updatedSuccessMessage", {
          message: location.state.successEdit,
        }), // إضافة namespace
      });
      window.history.replaceState({}, document.title);
    }
    const timer = setTimeout(() => {
      setAlertData(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state, t]);

  const handleSearch = (key: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };

  const { data: allCategories } = useAllCategories();
  const categories = allCategories?.original;

  const { data: allBrands } = useAllBrands();
  const brands = allBrands?.data;

  const { mutateAsync: deleteProductMutate } = useDeleteProduct();
  const handleDelete = async (id: ID) => {
    await alertDelete(id, deleteProductMutate, refetch, {
      confirmTitle: t("ProductsTable:productsPage.delete.confirmTitle"), // إضافة namespace
      confirmText: t("ProductsTable:productsPage.delete.confirmText"), // إضافة namespace
      confirmButtonText: t(
        "ProductsTable:productsPage.delete.confirmButtonText"
      ), // إضافة namespace
      cancelButtonText: t("ProductsTable:productsPage.delete.cancelButtonText"), // إضافة namespace
      successTitle: t("ProductsTable:productsPage.delete.successTitle"), // إضافة namespace
      successText: t("ProductsTable:productsPage.delete.successText"), // إضافة namespace
      errorTitle: t("ProductsTable:productsPage.delete.errorTitle"), // إضافة namespace
      errorText: t("ProductsTable:productsPage.delete.errorText"), // إضافة namespace
      lastButton: t("ProductsTable:productsPage.delete.lastButton"), // إضافة namespace
    });
  };

  const columns = buildColumns({
    includeImagesAndNameCell: true,
    includeStatus: true,
    includeUpdatedAt: true,
    includeCreatedAt: true,
    includeActions: true,
  });

  return (
    <>
      {/* Replaced PageMeta with SEO and updated content */}
      <SEO
        title={{
          ar: "تشطيبة - إدارة المنتجات",
          en: "Tashtiba - Product Management",
        }}
        description={{
          ar: "صفحة إدارة المنتجات في تشطيبة. عرض، إضافة، تعديل، وحذف المنتجات.",
          en: "Manage products on Tashtiba. View, add, edit, and delete products.",
        }}
        keywords={{
          ar: [
            "المنتجات",
            "إدارة المنتجات",
            "قائمة المنتجات",
            "تشطيبة",
            "متجر إلكتروني",
            "إدارة المخزون",
          ],
          en: [
            "products",
            "product management",
            "product list",
            "Tashtiba",
            "e-commerce store",
            "inventory management",
          ],
        }}
      />
      {alertData && (
        <Alert
          variant={alertData.variant}
          title={alertData.title}
          message={alertData.message}
        />
      )}
      <PageBreadcrumb
        pageTitle={t("ProductsTable:productsPage.title")}
        userType="admin"
      />{" "}
      {/* إضافة namespace */}
      <div>
        <SearchTable
          fields={[
            { key: "name", label: "Name", type: "input" }, // Corrected namespace usage for "Name"
            {
              key: "category_id",
              label: "Category", // إضافة namespace
              type: "select",
              options: categories?.map((category: Category) => ({
                label: category.name, // قد لا يكون هذا مترجمًا، فهو يأتي من الـ API
                value: category.id,
              })),
            },
            {
              key: "brand_id",
              label: "Brand", // إضافة namespace
              type: "select",
              options: brands?.map((brand: Brand) => ({
                label: brand.name, // قد لا يكون هذا مترجمًا، فهو يأتي من الـ API
                value: String(brand.id),
              })),
            },
            {
              key: "status",
              label: "Status", // إضافة namespace
              type: "select",
              options: [
                {
                  label: t("ProductsTable:productsPage.status.active"),
                  value: "active",
                }, // إضافة namespace
                {
                  label: t("ProductsTable:productsPage.status.inactive"),
                  value: "inactive",
                }, // إضافة namespace
              ],
            },
          ]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title={t("ProductsTable:productsPage.all")} // إضافة namespace
          headerAction={t("ProductsTable:productsPage.addNew")} // إضافة namespace
          href="/admin/products/create"
        >
          <BasicTable
            columns={columns}
            data={productsData}
            totalItems={totalProducts}
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={() => {}}
            isShowMore={true}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("ProductsTable:productsPage.table.loadingText")} // إضافة namespace
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Products;