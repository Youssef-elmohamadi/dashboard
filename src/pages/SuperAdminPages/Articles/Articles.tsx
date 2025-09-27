import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTableTS";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { alertDelete } from "../../../components/SuperAdmin/Tables/Alert";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns";
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
import { useTranslation } from "react-i18next";

// import { useAllCategories } from "../../../hooks/Api/Admin/useCategories/useCategories";
import { AxiosError } from "axios";
import { SearchValues } from "../../../types/Banners";
import { TableAlert } from "../../../types/Common";
import SEO from "../../../components/common/SEO/seo";
import {
  useArticlesWithPaginate,
  useDeleteArticle,
} from "../../../hooks/Api/SuperAdmin/useArticles/useSuperAdminArticles";

const Articles = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [searchValues, setSearchValues] = useState<SearchValues>({
    category_id: "",
    brand_id: "",
    status: "",
    name: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["ArticlesTable", "Meta"]);
  const { data, isLoading, isError, refetch, error } = useArticlesWithPaginate(
    pageIndex,
    searchValues
  );

  const pageSize = data?.data?.per_page ?? 15;
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

  const articlesData = data?.data.data || [];
  //const articlesData = data?.data || [];
  const totalArticles = data?.data.total ?? 0;

  const [alertData, setAlertData] = useState<TableAlert | null>(null);

  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("articlesPage.createdSuccess"),
        message: location.state.successCreate,
      });
    } else if (location.state?.successUpdate) {
      setAlertData({
        variant: "success",
        title: t("articlesPage.updatedSuccess"),
        message: location.state.successUpdate,
      });
    }
    const timer = setTimeout(() => {
      setAlertData(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state]);

  //const { data: allCategories } = useAllCategories();
  //const categories = allCategories?.original;

  const handleSearch = (key: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };
  const { mutateAsync: deleteArticleMutate } = useDeleteArticle();

  const handleDelete = async (id: number) => {
    await alertDelete(id, deleteArticleMutate, refetch, {
      confirmTitle: t("articlesPage.delete.confirmTitle"),
      confirmText: t("articlesPage.delete.confirmText"),
      confirmButtonText: t("articlesPage.delete.confirmButtonText"),
      successTitle: t("articlesPage.delete.successTitle"),
      successText: t("articlesPage.delete.successText"),
      errorTitle: t("articlesPage.delete.errorTitle"),
      errorText: t("articlesPage.delete.errorText"),
      lastButton: t("articlesPage.delete.lastButton"),
      cancelButtonText: t("articlesPage.delete.cancelButtonText"),
    });
  };

  const columns = buildColumns({
    includeArticleTitle: true,
    includeDateOfCreation: true,
    includeArticleIsActive: true,
    includePosition: true,
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
      <SEO
        title={{
          ar: " إدارة المقالات (سوبر أدمن)",
          en: "Articles Management (Super Admin)",
        }}
        description={{
          ar: "صفحة إدارة المقالات بواسطة المشرف العام في تشطيبة. عرض، إضافة، تعديل، وحذف المقالات.",
          en: "Manage articles by Super Admin on Tashtiba. View, add, edit, and delete articles.",
        }}
        keywords={{
          ar: [
            "مقالات المشرف العام",
            "إدارة المقالات",
            "إعلانات الموقع",
            "تشطيبة",
            "سوبر أدمن",
            "تصميم الموقع",
          ],
          en: [
            "super admin articles",
            "article management",
            "website ads",
            "Tashtiba",
            "super admin",
            "website design",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <PageBreadcrumb
        pageTitle={t("articlesPage.title")}
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
          title={t("articlesPage.all")}
          headerAction={t("articlesPage.addNew")}
          href="/super_admin/articles/create"
        >
          <BasicTable
            columns={columns}
            data={articlesData}
            totalItems={totalArticles}
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={() => {}}
            isShowMore={true}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("articlesPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Articles;
