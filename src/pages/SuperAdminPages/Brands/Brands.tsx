import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTableTS";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns"; // مكان الملف
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
import { openChangeStatusModal } from "../../../components/SuperAdmin/Tables/ChangeStatusModal";
import { useTranslation } from "react-i18next";
import {
  useChangeBrandStatus,
  useGetBrandsPaginate,
} from "../../../hooks/Api/SuperAdmin/useBrands/useSuperAdminBrandsManage";
import { AxiosError } from "axios";
import { TableAlert } from "../../../types/Common";
// import PageMeta from "../../../components/common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../../components/common/SEO/seo"; // تم استيراد SEO component

const Brands = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [searchValues, setSearchValues] = useState<{
    name: string;
  }>({
    name: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["BrandsTable", "Meta"]);
  const { data, isLoading, isError, error } = useGetBrandsPaginate(
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

  const brandsData = data?.data ?? [];
  const totalBrands = data?.total ?? 0;
  const handleSearch = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };
  const [alertData, setAlertData] = useState<TableAlert | null>(null);

  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: "Admin Created Successfully", // تم الإبقاء عليها كما هي حسب التعليمات
        message: location.state.successCreate,
      });
      window.history.replaceState({}, document.title);
    } else if (location.state?.successEdit) {
      setAlertData({
        variant: "success",
        title: "Admin Updated Successfully", // تم الإبقاء عليها كما هي حسب التعليمات
        message: location.state.successEdit,
      });
      window.history.replaceState({}, document.title);
    }

    const timer = setTimeout(() => {
      setAlertData(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state]);

  const handleGetStatus = (id: number) => {
    const item = brandsData?.find((el: any) => el.id === id);
    return item?.status;
  };

  const { mutateAsync: changeStatus } = useChangeBrandStatus();
  const handleChangeStatus = async (id: number) => {
    await openChangeStatusModal({
      id,
      getStatus: handleGetStatus,
      changeStatus: async (id, data) => {
        return await changeStatus({ id, data });
      },
      options: {
        Pending: t("brandsPage.status.pending"),
        Active: t("brandsPage.status.active"),
        InActive: t("brandsPage.status.inactive"),
      },
      Texts: {
        title: t("brandsPage.changeStatus.title"),
        inputPlaceholder: t("brandsPage.changeStatus.inputPlaceholder"),
        errorSelect: t("brandsPage.changeStatus.errorSelect"),
        success: t("brandsPage.changeStatus.success"),
        noChangeMessage: t("brandsPage.changeStatus.noChangeMessage"),
        errorResponse: t("brandsPage.changeStatus.errorResponse"),
        confirmButtonText: t("brandsPage.changeStatus.confirmButtonText"),
        cancelButtonText: t("brandsPage.changeStatus.cancelButtonText"),
      },
    });
  };

  const columns = buildColumns({
    includeDateOfCreation: true,
    includeImagesAndNameCell: true,
    includeStatus: true,
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
          ar: "تشطيبة - إدارة الماركات (سوبر أدمن)",
          en: "Tashtiba - Brand Management (Super Admin)",
        }}
        description={{
          ar: "صفحة إدارة الماركات بواسطة المشرف العام في تشطيبة. عرض، تغيير حالة، والتحكم في حسابات الماركات.",
          en: "Manage product brands by Super Admin on Tashtiba. View, change status, and control brand accounts.",
        }}
        keywords={{
          ar: [
            "ماركات المشرف العام",
            "إدارة الماركات",
            "براندات المنتجات",
            "تشطيبة",
            "سوبر أدمن",
            "إدارة الموقع",
          ],
          en: [
            "super admin brands",
            "brand management",
            "product brands",
            "Tashtiba",
            "super admin",
            "site management",
          ],
        }}
      />
      <PageBreadcrumb
        pageTitle={t("brandsPage.title")}
        userType="super_admin"
      />
      <div>
        <SearchTable
          fields={[{ key: "name", label: "Name", type: "input" }]} // تم الإبقاء عليها كما هي حسب التعليمات
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard title={t("brandsPage.all")}>
          <BasicTable
            columns={columns}
            data={brandsData}
            totalItems={totalBrands}
            isLoading={isLoading}
            isShowMore={true}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onChangeStatus={handleChangeStatus}
            isChangeStatus={true}
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
