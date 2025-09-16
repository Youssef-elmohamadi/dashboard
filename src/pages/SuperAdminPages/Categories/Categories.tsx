import { useEffect, useState } from "react";
import SEO from "../../../components/common/SEO/seo";

import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTableTS";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns"; // مكان الملف
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
import Alert from "../../../components/ui/alert/Alert";
import {
  useDeleteCategory,
  useGetCategories,
} from "../../../hooks/Api/SuperAdmin/useCategories/useSuperAdminCategpries";
import { AxiosError } from "axios";
import { SearchValues } from "../../../types/Categories";
import { TableAlert } from "../../../types/Common";
import { useLocation } from "react-router-dom";
import { alertDelete } from "../../../components/SuperAdmin/Tables/Alert";
const Categories = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [searchValues, setSearchValues] = useState<SearchValues>({
    name: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["CategoriesTable", "Meta"]);
  const { data, isLoading, isError, refetch, error } = useGetCategories(
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

  const categoriesData = data?.data ?? [];
  const totalCategories = data?.total ?? 0;

  const [alertData, setAlertData] = useState<TableAlert | null>(null);

  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("categoriesPage.createdSuccess"),
        message: location.state.successCreate,
      });
    } else if (location.state?.successUpdate) {
      setAlertData({
        variant: "success",
        title: t("categoriesPage.updatedSuccess"),
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
  const { mutateAsync: deleteCategoryMutate } = useDeleteCategory();

  const handleDelete = async (id: number) => {
    await alertDelete(id, deleteCategoryMutate, refetch, {
      confirmTitle: t("categoriesPage.delete.confirmTitle"),
      confirmText: t("categoriesPage.delete.confirmText"),
      confirmButtonText: t("categoriesPage.delete.confirmButtonText"),
      successTitle: t("categoriesPage.delete.successTitle"),
      successText: t("categoriesPage.delete.successText"),
      errorTitle: t("categoriesPage.delete.errorTitle"),
      errorText: t("categoriesPage.delete.errorText"),
      cancelButtonText: t("categoriesPage.delete.cancelButtonText"),
    });
  };

  const columns = buildColumns({
    includeImagesAndNameCell: true,
    includeStatus: true,
    includeDateOfCreation: true,
    includeActions: true,
    includeCommissionRate: true,
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
      <SEO
        title={{
          ar: " إدارة الفئات (سوبر أدمن)",
          en: "Category Management (Super Admin)",
        }}
        description={{
          ar: "صفحة إدارة فئات المنتجات بواسطة المشرف العام في تشطيبة. عرض، إضافة، تعديل، وحذف الفئات.",
          en: "Manage product categories by Super Admin on Tashtiba. View, add, edit, and delete categories.",
        }}
        keywords={{
          ar: [
            "فئات المشرف العام",
            "إدارة الفئات",
            "تصنيفات المنتجات",
            "تشطيبة",
            "سوبر أدمن",
            "إدارة الموقع",
          ],
          en: [
            "super admin categories",
            "category management",
            "product classifications",
            "Tashtiba",
            "super admin",
            "site management",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <PageBreadcrumb
        pageTitle={t("categoriesPage.title")}
        userType="super_admin"
      />
      <div>
        <SearchTable
          fields={[{ key: "name", label: "Name", type: "input" }]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title={t("categoriesPage.all")}
          headerAction={t("categoriesPage.addNew")}
          href="/super_admin/categories/create"
        >
          <BasicTable
            columns={columns}
            data={categoriesData}
            totalItems={totalCategories}
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={() => {}}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("categoriesPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Categories;
