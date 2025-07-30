import { useEffect, useState } from "react";
// import PageMeta from "../../../components/common/SEO/PageMeta"; // تم التعليق على استيراد PageMeta
import SEO from "../../../components/common/SEO/seo"; // تم استيراد SEO component
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/admin/Tables/BasicTableTS";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
import { useAllCategoriesPaginate } from "../../../hooks/Api/Admin/useCategories/useCategories";
import { AxiosError } from "axios";
import { SearchValues } from "../../../types/Categories";

const Categories = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [searchValues, setSearchValues] = useState<SearchValues>({
    name: "",
  });
  const { t } = useTranslation(["CategoriesTable", "Meta"]);
  const { data, isLoading, isError, error } = useAllCategoriesPaginate(
    pageIndex,
    searchValues
  );

  const pageSize = data?.original.per_page ?? 15;

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

  const categoriesData = data?.original?.data ?? [];
  const totalCategories = data?.original?.total ?? 0;

  const handleSearch = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };
  const columns = buildColumns({
    includeImageAndNameCell: true,
    includeStatus: true,
    includeCommissionRate: true,
    includeUpdatedAt: true,
    includeCreatedAt: true,
  });

  return (
    <>
      <SEO // PageMeta replaced with SEO, and data directly set
        title={{
          ar: "تشطيبة - إدارة الفئات",
          en: "Tashtiba - Category Management",
        }}
        description={{
          ar: "صفحة إدارة فئات المنتجات في تشطيبة. عرض، إضافة، تعديل، وحذف الفئات.",
          en: "Manage product categories on Tashtiba. View, add, edit, and delete categories.",
        }}
        keywords={{
          ar: [
            "الفئات",
            "إدارة الفئات",
            "تصنيفات المنتجات",
            "تشطيبة",
            "إدارة المتجر",
            "تصنيف",
          ],
          en: [
            "categories",
            "category management",
            "product categories",
            "Tashtiba",
            "store management",
            "classification",
          ],
        }}
      />
      <PageBreadcrumb
        pageTitle={t("CategoriesTable:categoriesPage.title")}
        userType="admin"
      />
      <div>
        <SearchTable
          fields={[
            {
              key: "name",
              label: "Name",
              type: "input",
            },
          ]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard title={t("CategoriesTable:categoriesPage.all")}>
          <BasicTable
            columns={columns}
            data={categoriesData}
            totalItems={totalCategories}
            isLoading={isLoading}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("CategoriesTable:categoriesPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Categories;
