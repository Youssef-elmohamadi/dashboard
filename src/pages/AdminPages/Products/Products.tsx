import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/SEO/PageMeta";
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
  const { t } = useTranslation(["ProductsTable"]);
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
        title: t("productsPage.createdSuccess"),
        message: location.state.successCreate,
      });
    } else if (location.state?.successEdit) {
      setAlertData({
        variant: "success",
        title: t("productsPage.updatedSuccess"),
        message: location.state.successEdit,
      });
    }
    const timer = setTimeout(() => {
      setAlertData(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state]);

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
      confirmTitle: t("productsPage.delete.confirmTitle"),
      confirmText: t("productsPage.delete.confirmText"),
      confirmButtonText: t("productsPage.delete.confirmButtonText"),
      cancelButtonText: t("productsPage.delete.cancelButtonText"),
      successTitle: t("productsPage.delete.successTitle"),
      successText: t("productsPage.delete.successText"),
      errorTitle: t("productsPage.delete.errorTitle"),
      errorText: t("productsPage.delete.errorText"),
      lastButton: t("productsPage.delete.lastButton"),
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
      <PageMeta
        title={t("productsPage.mainTitle")}
        description="Create and Update Your Products"
      />
      {alertData && (
        <Alert
          variant={alertData.variant}
          title={alertData.title}
          message={alertData.message}
        />
      )}
      <PageBreadcrumb pageTitle={t("productsPage.title")} userType="admin" />
      <div>
        <SearchTable
          fields={[
            { key: "name", label: "Name", type: "input" },
            {
              key: "category_id",
              label: "Category",
              type: "select",
              options: categories?.map((category: Category) => ({
                label: category.name,
                value: category.id,
              })),
            },
            {
              key: "brand_id",
              label: "Brand",
              type: "select",
              options: brands?.map((brand: Brand) => ({
                label: brand.name,
                value: String(brand.id),
              })),
            },
            {
              key: "status",
              label: "Status",
              type: "select",
              options: [
                { label: t("productsPage.status.active"), value: "active" },
                { label: t("productsPage.status.inactive"), value: "inactive" },
              ],
            },
          ]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title={t("productsPage.all")}
          headerAction={t("productsPage.addNew")}
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
            loadingText={t("productsPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Products;
