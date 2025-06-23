import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/admin/Tables/BasicTableTS";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
import {
  useAllAdmins,
  useDeleteAdmin,
} from "../../../hooks/Api/Admin/useVendorAdmins/useVendorAdmins";
import { AxiosError } from "axios";
import { ID } from "../../../types/Common";

const Admins = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [searchValues, setSearchValues] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["AdminsTable"]);

  const { data, isLoading, isError, refetch, error } = useAllAdmins(
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

  const adminsData = data?.data ?? [];
  const totalAdmins = data?.total ?? 0;
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("adminsPage.createdSuccess"),
        message: location.state.successCreate,
      });
      window.history.replaceState({}, document.title);
    } else if (location.state?.successEdit) {
      setAlertData({
        variant: "success",
        title: t("adminsPage.updatedSuccess"),
        message: location.state.successEdit,
      });
      window.history.replaceState({}, document.title);
    }

    const timer = setTimeout(() => {
      setAlertData(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state]);

  const handleSearch = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };
  const { mutateAsync: deleteAdminMutate } = useDeleteAdmin();

  const handleDelete = async (id: ID) => {
    await alertDelete(id, deleteAdminMutate, refetch, {
      confirmTitle: t("adminsPage.delete.confirmTitle"),
      confirmText: t("adminsPage.delete.confirmText"),
      confirmButtonText: t("adminsPage.delete.confirmButtonText"),
      cancelButtonText: t("adminsPage.delete.cancelButtonText"),
      successTitle: t("adminsPage.delete.successTitle"),
      successText: t("adminsPage.delete.successText"),
      errorTitle: t("adminsPage.delete.errorTitle"),
      errorText: t("adminsPage.delete.errorText"),
      lastButton: t("adminsPage.delete.lastButton"),
    });
  };

  const columns = buildColumns({
    includeName: true,
    includeEmail: true,
    includeRoles: true,
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
      <PageMeta title={t("adminsPage.mainTitle")} description="Admins" />
      <PageBreadcrumb pageTitle={t("adminsPage.title")} userType="admin" />
      <SearchTable
        fields={[
          { key: "name", label: "Name", type: "input" },
          { key: "email", label: "Email", type: "input" },
          { key: "phone", label: "Phone", type: "input" },
        ]}
        setSearchParam={handleSearch}
        searchValues={searchValues}
      />
      <ComponentCard
        title={t("adminsPage.all")}
        headerAction={t("adminsPage.addNew")}
        href="/admin/admins/create"
      >
        <BasicTable
          columns={columns}
          data={adminsData}
          totalItems={totalAdmins}
          isLoading={isLoading}
          onDelete={handleDelete}
          onEdit={() => {}}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          unauthorized={unauthorized}
          globalError={globalError}
          loadingText={t("adminsPage.table.loadingText")}
        />
      </ComponentCard>
    </>
  );
};

export default Admins;
