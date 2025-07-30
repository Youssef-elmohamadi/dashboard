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
import { ID, TableAlert } from "../../../types/Common";
import { AdminFilters } from "../../../types/Admins";
// import PageMeta from "../../../components/common/SEO/PageMeta"; // تم التعليق على استيراد PageMeta
import SEO from "../../../components/common/SEO/seo"; // تم استيراد SEO component

const Admins = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [searchValues, setSearchValues] = useState<AdminFilters>({
    name: "",
    email: "",
    phone: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["AdminsTable", "Meta"]);

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
  const [alertData, setAlertData] = useState<TableAlert | null>(null);

  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("AdminsTable:adminsPage.createdSuccessTitle"),
        message: t("AdminsTable:adminsPage.createdSuccessMessage", {
          message: location.state.successCreate,
        }), // تم التعديل
      });
      window.history.replaceState({}, document.title);
    } else if (location.state?.successEdit) {
      setAlertData({
        variant: "success",
        title: t("AdminsTable:adminsPage.updatedSuccessTitle"),
        message: t("AdminsTable:adminsPage.updatedSuccessMessage", {
          message: location.state.successEdit,
        }),
      });
      window.history.replaceState({}, document.title);
    }

    const timer = setTimeout(() => {
      setAlertData(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state, t]);

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
      confirmTitle: t("AdminsTable:adminsPage.delete.confirmTitle"),
      confirmText: t("AdminsTable:adminsPage.delete.confirmText"),
      confirmButtonText: t("AdminsTable:adminsPage.delete.confirmButtonText"),
      cancelButtonText: t("AdminsTable:adminsPage.delete.cancelButtonText"),
      successTitle: t("AdminsTable:adminsPage.delete.successTitle"),
      successText: t("AdminsTable:adminsPage.delete.successText"),
      errorTitle: t("AdminsTable:adminsPage.delete.errorTitle"),
      errorText: t("AdminsTable:adminsPage.delete.errorText"),
      lastButton: t("AdminsTable:adminsPage.delete.lastButton"),
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
      <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
        title={{
          ar: "تشطيبة - إدارة المسؤولين",
          en: "Tashtiba - Admin Management",
        }}
        description={{
          ar: "إدارة حسابات المسؤولين في نظام تشطيبة. عرض، إضافة، تعديل، وحذف المسؤولين.",
          en: "Manage administrator accounts in Tashtiba system. View, add, edit, and delete administrators.",
        }}
        keywords={{
          ar: [
            "المسؤولين",
            "إدارة المسؤولين",
            "حسابات المسؤولين",
            "تشطيبة",
            "أدمن",
            "تحكم",
            "صلاحيات",
          ],
          en: [
            "admins",
            "admin management",
            "admin accounts",
            "Tashtiba",
            "administrator",
            "control panel",
            "permissions",
          ],
        }}
      />
      <PageBreadcrumb
        pageTitle={t("AdminsTable:adminsPage.title")}
        userType="admin"
      />
      <SearchTable
        fields={[
          { key: "name", label: "Name", type: "input" }, // تم التعديل
          { key: "email", label: "Email", type: "input" }, // تم التعديل
          { key: "phone", label: "Phone", type: "input" }, // تم التعديل
        ]}
        setSearchParam={handleSearch}
        searchValues={searchValues}
      />
      <ComponentCard
        title={t("AdminsTable:adminsPage.all")}
        headerAction={t("AdminsTable:adminsPage.addNew")}
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
          loadingText={t("AdminsTable:adminsPage.table.loadingText")}
        />
      </ComponentCard>
    </>
  );
};

export default Admins;
