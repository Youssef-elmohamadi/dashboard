import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/admin/Tables/BasicTableTS";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
import { useAllCategoriesPaginate } from "../../../hooks/useCategories";
const Categories = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [searchValues, setSearchValues] = useState<{
    name: string;
  }>({
    name: "",
  });
  const { t } = useTranslation(["CategoriesTable"]);
  const { data, isLoading, isError, error } = useAllCategoriesPaginate(
    pageIndex,
    searchValues
  );

  const pageSize = data?.per_page ?? 15;
  useEffect(() => {
    if (isError && error?.response?.status) {
      const status = error.response.status;
      if (status === 403 || status === 401) {
        setUnauthorized(true);
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
    includeUpdatedAt: true,
    includeCreatedAt: true,
    includeActions: false,
    includeCommissionRate: true,
  });

  return (
    <>
      <PageMeta
        title="Tashtiba | Categories"
        description="Show all Categories"
      />
      <PageBreadcrumb pageTitle={t("categoriesPage.title")} userType="admin" />
      <div>
        <SearchTable
          fields={[{ key: "name", label: "Name", type: "input" }]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard title={t("categoriesPage.all")}>
          <BasicTable
            columns={columns}
            data={categoriesData}
            totalItems={totalCategories}
            isLoading={isLoading}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            loadingText={t("categoriesPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Categories;
