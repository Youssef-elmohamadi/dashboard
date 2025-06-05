import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import BasicTable from "../../../components/admin/Tables/BasicTableTS";
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
import {
  useDeleteRole,
  useRolesPaginate,
} from "../../../hooks/Api/Admin/useRoles/useRoles";
import { AxiosError } from "axios";

const Roles = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [searchValues, setSearchValues] = useState<{
    name: string;
  }>({
    name: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["RolesTable"]);
  const { data, isLoading, isError, error, refetch } = useRolesPaginate(
    pageIndex,
    searchValues
  );
  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setUnauthorized(true);
      } else if (status === 500) {
        setGlobalError(true);
      }
    }
  }, [isError, error]);
  const pageSize = data?.per_page ?? 15;
  const rolesData = data?.data ?? [];
  const totalRoles = data?.total ?? 0;
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("rolesPage.createdSuccess"),
        message: location.state.successCreate,
      });
    } else if (location.state?.successUpdate) {
      setAlertData({
        variant: "success",
        title: t("rolesPage.updatedSuccess"),
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

  const { mutateAsync: deleteRoleMutate } = useDeleteRole();
  const handleDelete = async (id: number) => {
    const confirmed = await alertDelete(id, deleteRoleMutate, refetch, {
      confirmTitle: t("rolesPage.delete.confirmTitle"),
      confirmText: t("rolesPage.delete.confirmText"),
      confirmButtonText: t("rolesPage.delete.confirmButtonText"),
      cancelButtonText: t("rolesPage.delete.cancelButtonText"),
      successTitle: t("rolesPage.delete.successTitle"),
      successText: t("rolesPage.delete.successText"),
      errorTitle: t("rolesPage.delete.errorTitle"),
      errorText: t("rolesPage.delete.errorText"),
      lastButton: t("rolesPage.delete.lastButton"),
    });
  };
  const columns = buildColumns({
    includeRoleName: true,
    includeEmail: false,
    includeRoles: false,
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
        title="Tashtiba | Manage Roles"
        description="This is the roles listing page."
      />
      <PageBreadcrumb pageTitle={t("rolesPage.title")} userType="admin" />
      <div>
        <SearchTable
          fields={[{ key: "name", label: "Name", type: "input" }]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title={t("rolesPage.all")}
          headerAction={t("rolesPage.addNew")}
          href="/admin/roles/create"
        >
          <BasicTable
            columns={columns}
            data={rolesData}
            totalItems={totalRoles}
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={() => {}}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("rolesPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Roles;
