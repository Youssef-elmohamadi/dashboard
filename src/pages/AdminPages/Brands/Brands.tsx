import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/admin/Tables/BasicTableTS";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
import {
  useAllBrandsPaginate,
  useDeleteBrand,
} from "../../../hooks/Api/Admin/useBrands/useBrands";
import Alert from "../../../components/ui/alert/Alert";
import { AxiosError } from "axios";
import { SearchValues } from "../../../types/Brands";
import { ID, TableAlert } from "../../../types/Common";
const Brands = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [searchValues, setSearchValues] = useState<SearchValues>({
    name: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["BrandsTable"]);
  const { data, isLoading, isError, refetch, error } = useAllBrandsPaginate(
    pageIndex,
    searchValues
  );
  console.log(data);

  const pageSize = data?.per_page ?? 15;
  const brandsData = data?.data ?? [];
  const totalBrands = data?.total ?? 0;
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

  const [alertData, setAlertData] = useState<TableAlert | null>(null);
  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("brandsPage.createdSuccess"),
        message: location.state.successCreate,
      });
    } else if (location.state?.successEdit) {
      setAlertData({
        variant: "success",
        title: t("brandsPage.updatedSuccess"),
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
  const { mutateAsync } = useDeleteBrand();
  const handleDelete = async (id: ID) => {
    await alertDelete(id, mutateAsync, refetch, {
      confirmTitle: t("brandsPage.delete.confirmTitle"),
      confirmText: t("brandsPage.delete.confirmText"),
      confirmButtonText: t("brandsPage.delete.confirmButtonText"),
      cancelButtonText: t("brandsPage.delete.cancelButtonText"),
      successTitle: t("brandsPage.delete.successTitle"),
      successText: t("brandsPage.delete.successText"),
      errorTitle: t("brandsPage.delete.errorTitle"),
      errorText: t("brandsPage.delete.errorText"),
      lastButton: t("brandsPage.delete.lastButton"),
    });
  };

  const columns = buildColumns({
    includeImageAndNameCell: true,
    includeStatus: true,
    includeUpdatedAt: true,
    includeCreatedAt: true,
    includeActions: true,
  });

  return (
    <>
      {alertData && (
        <Alert
          variant={alertData.variant}
          title={alertData.title}
          message={alertData.message}
        />
      )}
      <PageMeta
        title={t("brandsPage.mainTitle")}
        description="Create and Update Your Brands"
      />
      <PageBreadcrumb pageTitle={t("brandsPage.title")} userType="admin" />
      <div>
        <SearchTable
          fields={[{ key: "name", label: "Name", type: "input" }]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title={t("brandsPage.all")}
          headerAction={t("brandsPage.addNew")}
          href="/admin/brands/create"
        >
          <BasicTable
            columns={columns}
            data={brandsData}
            totalItems={totalBrands}
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={() => {}}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("brandsPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Brands;
