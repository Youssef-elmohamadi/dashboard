import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTableTS";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { alertDelete } from "../../../components/SuperAdmin/Tables/Alert";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns"; // مكان الملف
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
import { openChangeStatusModal } from "../../../components/SuperAdmin/Tables/ChangeStatusModal"; // هذا الاستيراد غير مستخدم في هذه الصفحة، لذا سيبقى كما هو
import { useTranslation } from "react-i18next";
import {
  useDeleteRole,
  useRolesPaginate,
} from "../../../hooks/Api/SuperAdmin/useRoles/useSuperAdminRoles";
import { AxiosError } from "axios";
import { SearchValues } from "../../../types/Roles";
// import PageMeta from "../../../components/common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
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
        message: location.state.successUpdate,
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
    await alertDelete(id, deleteRoleMutate, refetch, {
      confirmTitle: t("rolesPage.delete.confirmTitle"),
      confirmText: t("rolesPage.delete.confirmText"),
      confirmButtonText: t("rolesPage.delete.confirmButtonText"),
      cancelButtonText: t("rolesPage.delete.cancelButtonText"),
      successTitle: t("rolesPage.delete.successTitle"),
      successText: t("rolesPage.delete.successText"),
      errorTitle: t("rolesPage.delete.errorTitle"),
      errorText: t("rolesPage.delete.errorText"),
      lastButton: t("rolesPage.delete.lastButton"),
      unauthorized: t("rolesPage.delete.unauthorized"),
      generalError: t("rolesPage.delete.generalError"),
    });
  };

  const columns = buildColumns({
    includeRoleName: true,
    includeUpdatedAt: true,
    includeDateOfCreation: true,
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
          ar: "تشطيبة - إدارة الصلاحيات (سوبر أدمن)",
          en: "Tashtiba - Role Management (Super Admin)",
        }}
        description={{
          ar: "صفحة إدارة صلاحيات المستخدمين بواسطة المشرف العام في تشطيبة. عرض، إضافة، تعديل، وحذف الأدوار والصلاحيات.",
          en: "Manage user roles and permissions by Super Admin on Tashtiba. View, add, edit, and delete roles and their access rights.",
        }}
        keywords={{
          ar: [
            "صلاحيات المشرف العام",
            "إدارة الصلاحيات",
            "أدوار المستخدمين",
            "تشطيبة",
            "سوبر أدمن",
            "إدارة الموقع",
          ],
          en: [
            "super admin roles",
            "role management",
            "user permissions",
            "Tashtiba",
            "super admin",
            "site management",
          ],
        }}
      />
      <PageBreadcrumb pageTitle={t("rolesPage.title")} userType="super_admin" />
      <div>
        <SearchTable
          fields={[{ key: "name", label: "Name", type: "input" }]} // تم الإبقاء عليها كما هي حسب التعليمات
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title={t("rolesPage.all")}
          headerAction={t("rolesPage.addNew")}
          href="/super_admin/roles/create"
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
