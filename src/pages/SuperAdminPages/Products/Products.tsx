import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTableTS";
import { useEffect, useState } from "react";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns";
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
import { openChangeStatusModal } from "../../../components/SuperAdmin/Tables/ChangeStatusModal";
import { useTranslation } from "react-i18next";
import {
  useChangeProductStatus,
  useGetProductsPaginate,
} from "../../../hooks/Api/SuperAdmin/useProducts/useSuperAdminProductsManage";
import { useAllCategories } from "../../../hooks/Api/SuperAdmin/useCategories/useSuperAdminCategpries";
import { useAllBrands } from "../../../hooks/Api/SuperAdmin/useBrands/useSuperAdminBrandsManage";
import { AxiosError } from "axios";
import { SearchValues } from "../../../types/Product";
import { Category } from "../../../types/Categories";
import { Brand } from "../../../types/Brands";
import SEO from "../../../components/common/SEO/seo";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

const Products = () => {
  const { lang } = useDirectionAndLanguage();
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<SearchValues>({
    category_id: "",
    brand_id: "",
    status: "",
    name: "",
  });
  const { t } = useTranslation(["ProductsTable"]);
  const { data, isLoading, isError, error } = useGetProductsPaginate(
    pageIndex,
    searchValues
  );

  const pageSize = data?.per_page ?? 15;
  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setUnauthorized(true);
      } else if (status === 500) {
        setGlobalError(true);
      } else {
        setGlobalError(true);
      }
    }
  }, [isError, error]);

  const productsData = data?.data ?? [];

  const totalProducts = data?.total ?? 0;
  const handleSearch = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };

  const handleGetStatus = (id: number) => {
    const item = productsData?.find((el: any) => el.id === id);
    return item?.status;
  };

  const { data: allCategories } = useAllCategories();
  const categories = allCategories?.original;
  const { data: allBrands } = useAllBrands();
  const brands = allBrands?.data;
  const { mutateAsync: changeStatus } = useChangeProductStatus();

  const handleChangeStatus = async (id: number) => {
    await openChangeStatusModal({
      id,
      getStatus: handleGetStatus,
      changeStatus: async (id, data) => {
        return await changeStatus({ id, data });
      },
      options: {
        Pending: t("productsPage.status.pending"),
        Active: t("productsPage.status.active"),
        InActive: t("productsPage.status.inactive"),
      },
      Texts: {
        title: t("productsPage.changeStatus.title"),
        inputPlaceholder: t("productsPage.changeStatus.inputPlaceholder"),
        errorSelect: t("productsPage.changeStatus.errorSelect"),
        success: t("productsPage.changeStatus.success"),
        noChangeMessage: t("productsPage.changeStatus.noChangeMessage"),
        errorResponse: t("productsPage.changeStatus.errorResponse"),
        confirmButtonText: t("productsPage.changeStatus.confirmButtonText"),
        cancelButtonText: t("productsPage.changeStatus.cancelButtonText"),
      },
    });
  };

  const columns = buildColumns({
    includeDateOfCreation: true,
    productsIncludeImagesAndNameCell: true,
    includeStatus: true,
    includeActions: true,
  });
  return (
    <>
      <SEO
        title={{
          ar: " إدارة المنتجات (سوبر أدمن)",
          en: "Product Management (Super Admin)",
        }}
        description={{
          ar: "صفحة إدارة المنتجات بواسطة المشرف العام في تشطيبة. عرض، تغيير حالة، والتحكم في المنتجات.",
          en: "Manage products by Super Admin on Tashtiba. View, change status, and control products.",
        }}
        keywords={{
          ar: [
            "منتجات المشرف العام",
            "إدارة المنتجات",
            "قائمة المنتجات",
            "تشطيبة",
            "سوبر أدمن",
            "المخزون",
          ],
          en: [
            "super admin products",
            "product management",
            "product list",
            "Tashtiba",
            "super admin",
            "inventory",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <PageBreadcrumb
        pageTitle={t("productsPage.title")}
        userType="super_admin"
      />
      <div>
        <SearchTable
          fields={[
            { key: "name", label: "Name", type: "input" },
            {
              key: "category_id",
              label: "Category",
              type: "select",
              options: categories?.map((category: Category) => ({
                label: category[`name_${lang}`],
                value: category.id,
              })),
            },
            {
              key: "brand_id",
              label: "Brand",
              type: "select",
              options: brands?.map((brand: Brand) => ({
                label: brand[`name_${lang}`],
                value: brand.id,
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
        <ComponentCard title={t("productsPage.title")}>
          <BasicTable
            columns={columns}
            data={productsData}
            totalItems={totalProducts}
            isLoading={isLoading}
            isShowMore={true}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onChangeStatus={handleChangeStatus}
            isChangeStatus={true}
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
