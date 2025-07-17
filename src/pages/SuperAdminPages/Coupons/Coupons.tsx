import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTableTS";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { alertDelete } from "../../../components/SuperAdmin/Tables/Alert";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns"; // مكان الملف
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
import {
  useAllCoupons,
  useDeleteCoupon,
} from "../../../hooks/Api/SuperAdmin/useCoupons/useCoupons";
import { AxiosError } from "axios";
import { CouponFilters } from "../../../types/Coupons";
import { TableAlert } from "../../../types/Common";
// import PageMeta from "../../../components/common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../../components/common/SEO/seo"; // تم استيراد SEO component

const Coupons = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [searchValues, setSearchValues] = useState<CouponFilters>({
    active: "",
    code: "",
    type: "",
    from_date: "",
    to_date: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["CouponsTable", "Meta"]);
  const { data, isLoading, isError, refetch, error } = useAllCoupons(
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
  console.log(data);

  const couponsData = data?.data ?? [];
  const totalCoupons = data?.total ?? 0;

  const [alertData, setAlertData] = useState<TableAlert | null>(null);

  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("couponsPage.createdSuccess"),
        message: location.state.successCreate,
      });
      window.history.replaceState({}, document.title);
    } else if (location.state?.successEdit) {
      setAlertData({
        variant: "success",
        title: t("couponsPage.updatedSuccess"),
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
  const { mutateAsync: deleteCouponMutate } = useDeleteCoupon();
  const handleDelete = async (id: number) => {
    await alertDelete(id, deleteCouponMutate, refetch, {
      confirmTitle: t("couponsPage.delete.confirmTitle"),
      confirmText: t("couponsPage.delete.confirmText"),
      confirmButtonText: t("couponsPage.delete.confirmButtonText"),
      cancelButtonText: t("couponsPage.delete.cancelButtonText"),
      successTitle: t("couponsPage.delete.successTitle"),
      successText: t("couponsPage.delete.successText"),
      errorTitle: t("couponsPage.delete.errorTitle"),
      errorText: t("couponsPage.delete.errorText"),
      lastButton: t("couponsPage.delete.lastButton"),
    });
  };

  const columns = buildColumns({
    includeCode: true,
    includeType: true,
    includeValue: true,
    includeLimit: true,
    includeUsedCount: true,
    includeExpiresAt: true,
    includeIsActive: true,
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
          ar: "تشطيبة - إدارة الكوبونات (سوبر أدمن)",
          en: "Tashtiba - Coupon Management (Super Admin)",
        }}
        description={{
          ar: "صفحة إدارة الكوبونات بواسطة المشرف العام في تشطيبة. عرض، إضافة، تعديل، وحذف الكوبونات.",
          en: "Manage discount coupons by Super Admin on Tashtiba. View, add, edit, and delete coupons.",
        }}
        keywords={{
          ar: [
            "كوبونات المشرف العام",
            "إدارة الكوبونات",
            "خصومات",
            "تشطيبة",
            "سوبر أدمن",
            "العروض",
          ],
          en: [
            "super admin coupons",
            "coupon management",
            "discounts",
            "Tashtiba",
            "super admin",
            "promotions",
          ],
        }}
      />
      <PageBreadcrumb
        pageTitle={t("couponsPage.title")}
        userType="super_admin"
      />
      <div>
        <SearchTable
          fields={[
            { key: "code", label: "Code", type: "input" }, // تم الإبقاء عليها كما هي حسب التعليمات

            {
              key: "status",
              label: "Status", // تم الإبقاء عليها كما هي حسب التعليمات
              type: "select",
              options: [
                { label: t("couponsPage.status.active"), value: "1" },
                { label: t("couponsPage.status.inactive"), value: "0" },
              ],
            },
            {
              key: "type",
              label: "Type", // تم الإبقاء عليها كما هي حسب التعليمات
              type: "select",
              options: [
                { label: t("couponsPage.types.fixed"), value: "fixed" },
                { label: t("couponsPage.types.percent"), value: "percent" },
              ],
            },
            { key: "from_date", label: "From", type: "date" }, // تم الإبقاء عليها كما هي حسب التعليمات
            { key: "to_date", label: "To", type: "date" }, // تم الإبقاء عليها كما هي حسب التعليمات
          ]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title={t("couponsPage.all")}
          headerAction={t("couponsPage.addNew")}
          href="/super_admin/coupons/create"
        >
          <BasicTable
            columns={columns}
            data={couponsData}
            totalItems={totalCoupons}
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={() => {}}
            isShowMore={true}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("couponsPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Coupons;