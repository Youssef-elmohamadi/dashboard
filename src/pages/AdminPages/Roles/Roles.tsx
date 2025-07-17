import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { SearchValues } from "../../../types/Roles";
import { ID, TableAlert } from "../../../types/Common";
// import PageMeta from "../../../components/common/SEO/PageMeta"; // تم التعليق على استيراد PageMeta
import SEO from "../../../components/common/SEO/seo"; // تم استيراد SEO component

const Roles = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [searchValues, setSearchValues] = useState<SearchValues>({
    name: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["RolesTable", "Meta"]);
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
      } else {
        setGlobalError(true);
      }
    }
  }, [isError, error]);
  const pageSize = data?.per_page ?? 15;
  const rolesData = data?.data ?? [];
  const totalRoles = data?.total ?? 0;
  const [alertData, setAlertData] = useState<TableAlert | null>(null);

  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("RolesTable:rolesPage.createdSuccessTitle"), // Added namespace
        message: t("RolesTable:rolesPage.createdSuccessMessage", {
          message: location.state.successCreate,
        }), // Added namespace
      });
      window.history.replaceState({}, document.title); // Keep this to clear state after showing alert
    } else if (location.state?.successUpdate) {
      setAlertData({
        variant: "success",
        title: t("RolesTable:rolesPage.updatedSuccessTitle"), // Added namespace
        message: t("RolesTable:rolesPage.updatedSuccessMessage", {
          message: location.state.successUpdate,
        }), // Added namespace
      });
      window.history.replaceState({}, document.title); // Keep this to clear state after showing alert
    }
    const timer = setTimeout(() => {
      setAlertData(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state, t]); // Added t to dependencies

  const handleSearch = (key: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };

  const { mutateAsync: deleteRoleMutate } = useDeleteRole();
  const handleDelete = async (id: ID) => {
    await alertDelete(id, deleteRoleMutate, refetch, {
      confirmTitle: t("RolesTable:rolesPage.delete.confirmTitle"), // Added namespace
      confirmText: t("RolesTable:rolesPage.delete.confirmText"), // Added namespace
      confirmButtonText: t("RolesTable:rolesPage.delete.confirmButtonText"), // Added namespace
      cancelButtonText: t("RolesTable:rolesPage.delete.cancelButtonText"), // Added namespace
      successTitle: t("RolesTable:rolesPage.delete.successTitle"), // Added namespace
      successText: t("RolesTable:rolesPage.delete.successText"), // Added namespace
      errorTitle: t("RolesTable:rolesPage.delete.errorTitle"), // Added namespace
      errorText: t("RolesTable:rolesPage.delete.errorText"), // Added namespace
      lastButton: t("RolesTable:rolesPage.delete.lastButton"), // Added namespace
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
      <SEO // تم استبدال PageMeta بـ SEO وتحديد البيانات مباشرة
        title={{
          ar: "تشطيبة - إدارة الصلاحيات",
          en: "Tashtiba - Role Management",
        }}
        description={{
          ar: "إدارة صلاحيات المستخدمين في نظام تشطيبة. عرض، إضافة، تعديل، وحذف الأدوار والصلاحيات.",
          en: "Manage user roles and permissions in Tashtiba system. View, add, edit, and delete roles and their access rights.",
        }}
        keywords={{
          ar: [
            "صلاحيات",
            "أدوار المستخدمين",
            "إدارة الصلاحيات",
            "تشطيبة",
            "تحكم",
            "أذونات",
          ],
          en: [
            "roles",
            "user permissions",
            "role management",
            "Tashtiba",
            "access control",
            "privileges",
          ],
        }}
      />
      <PageBreadcrumb
        pageTitle={t("RolesTable:rolesPage.title")}
        userType="admin"
      />{" "}
      {/* Added namespace */}
      <div>
        <SearchTable
          fields={[
            { key: "name", label: t("RolesTable:search.name"), type: "input" },
          ]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title={t("RolesTable:rolesPage.all")} // Added namespace
          headerAction={t("RolesTable:rolesPage.addNew")} // Added namespace
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
            loadingText={t("RolesTable:rolesPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Roles;
