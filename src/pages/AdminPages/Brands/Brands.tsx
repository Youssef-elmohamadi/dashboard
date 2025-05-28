import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/admin/Tables/BasicTableTS";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  deleteBrand,
} from "../../../api/AdminApi/brandsApi/_requests";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
import {useAllBrandsPaginate } from "../../../hooks/useBrands";
import Alert from "../../../components/ui/alert/Alert";
const Brands = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [searchValues, setSearchValues] = useState<{
    name: string;
  }>({
    name: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["BrandsTable"]);
  const { data, isLoading, isError, refetch, error } = useAllBrandsPaginate(
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

  const brandsData = data?.data ?? [];
  const totalBrands = data?.total ?? 0;
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);
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
  const handleDelete = async (id: number) => {
    const confirmed = await alertDelete(id, deleteBrand, refetch, {
      confirmTitle: t("brandsTable.delete.confirmTitle"),
      confirmText: t("brandsTable.delete.confirmText"),
      confirmButtonText: t("brandsTable.delete.confirmButtonText"),
      cancelButtonText: t("brandsTable.delete.cancelButtonText"),
      successTitle: t("brandsTable.delete.successTitle"),
      successText: t("brandsTable.delete.successText"),
      errorTitle: t("brandsTable.delete.errorTitle"),
      errorText: t("brandsTable.delete.errorText"),
    });
  };

  const columns = buildColumns({
    includeBrandName: false,
    includeImageAndNameCell: true,
    includeEmail: false,
    includeRoles: false,
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
        title="Tashtiba | Manege Brands"
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
            loadingText={t("brandsPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Brands;
