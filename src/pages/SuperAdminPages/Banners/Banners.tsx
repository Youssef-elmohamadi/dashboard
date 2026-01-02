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
import {
  useBannersWithPaginate,
  useDeleteBanner,
} from "../../../hooks/Api/SuperAdmin/useBanners/useSuperAdminBanners";
import { AxiosError } from "axios";
import { SearchValues } from "../../../types/Banners";
import { TableAlert } from "../../../types/Common";
import SEO from "../../../components/common/SEO/seo";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";

const Banners = () => {
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
  const { t } = useTranslation(["BannersTable", "Meta"]);
  const { data, isLoading, isError, refetch, error } = useBannersWithPaginate(
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

  const bannersData = data?.data.data || [];
  const totalBanners = data?.data.total ?? 0;

  const [alertData, setAlertData] = useState<TableAlert | null>(null);

  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("bannersPage.createdSuccess"),
        message: location.state.successCreate,
      });
    } else if (location.state?.successUpdate) {
      setAlertData({
        variant: "success",
        title: t("bannersPage.updatedSuccess"),
        message: location.state.successUpdate,
      });
    }
    const timer = setTimeout(() => {
      setAlertData(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state]);

  const { data: allCategories } = useCategories();
  const categories = allCategories;

  const handleSearch = (key: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };
  const { mutateAsync: deleteBannerMutate } = useDeleteBanner();

  const handleDelete = async (id: number) => {
    await alertDelete(id, deleteBannerMutate, refetch, {
      confirmTitle: t("bannersPage.delete.confirmTitle"),
      confirmText: t("bannersPage.delete.confirmText"),
      confirmButtonText: t("bannersPage.delete.confirmButtonText"),
      successTitle: t("bannersPage.delete.successTitle"),
      successText: t("bannersPage.delete.successText"),
      errorTitle: t("bannersPage.delete.errorTitle"),
      errorText: t("bannersPage.delete.errorText"),
      lastButton: t("bannersPage.delete.lastButton"),
      cancelButtonText: t("bannersPage.delete.cancelButtonText"),
    });
  };

  const columns = buildColumns({
    includeTitle: true,
    includeDateOfCreation: true,
    includeBannerIsActive: true,
    includePosition: true,
    includeActions: true,
    categories: categories,
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
          ar: " إدارة البانرات (سوبر أدمن)",
          en: "Banner Management (Super Admin)",
        }}
        description={{
          ar: "صفحة إدارة البانرات الإعلانية بواسطة المشرف العام في تشطيبة. عرض، إضافة، تعديل، وحذف البانرات.",
          en: "Manage advertising banners by Super Admin on Tashtiba. View, add, edit, and delete banners.",
        }}
        keywords={{
          ar: [
            "بانرات المشرف العام",
            "إدارة البانرات",
            "إعلانات الموقع",
            "تشطيبة",
            "سوبر أدمن",
            "تصميم الموقع",
          ],
          en: [
            "super admin banners",
            "banner management",
            "website ads",
            "Tashtiba",
            "super admin",
            "website design",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <PageBreadcrumb
        pageTitle={t("bannersPage.title")}
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
          title={t("bannersPage.all")}
          headerAction={t("bannersPage.addNew")}
          href="/super_admin/banners/create"
        >
          <BasicTable
            columns={columns}
            data={bannersData}
            totalItems={totalBanners}
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={() => {}}
            isShowMore={true}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("bannersPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Banners;
