import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/admin/Tables/BasicTableTS";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns"; // مكان الملف
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
import { useAllCoupons, useDeleteCoupon } from "../../../hooks/useCoupons";
type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  vendor_id: number;
  avatar: string;
  created_at: string;
  updated_at: string;
  vendor: { id: number; name: string };
  roles: { id: number; name: string }[];
};

const Coupons = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [searchValues, setSearchValues] = useState<{
    active: string;
    code: string;
    type: string;
    from_date: string;
    to_date: string;
  }>({
    active: "",
    code: "",
    type: "",
    from_date: "",
    to_date: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["CouponsTable"]);
  const { data, isLoading, isError, refetch, error } = useAllCoupons(
    pageIndex,
    searchValues
  );
  const pageSize = data?.per_page ?? 15;
  useEffect(() => {
    if (isError && error?.response?.status) {
      const status = error.response.status;
      if (status === 403 || status === 401) {
        setUnauthorized(true);
      }
    }
  }, [isError, error]);

  const couponsData = data?.data ?? [];
  const totalCoupons = data?.total ?? 0;

  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);

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
    const confirmed = await alertDelete(id, deleteCouponMutate, refetch, {
      confirmTitle: t("couponsPage.delete.confirmTitle"),
      confirmText: t("couponsPage.delete.confirmText"),
      confirmButtonText: t("couponsPage.delete.confirmButtonText"),
      cancelButtonText: t("couponsPage.delete.cancelButtonText"),
      successTitle: t("couponsPage.delete.successTitle"),
      successText: t("couponsPage.delete.successText"),
      errorTitle: t("couponsPage.delete.errorTitle"),
      errorText: t("couponsPage.delete.errorText"),
    });
  };

  const columns = buildColumns<User>({
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
      <PageMeta
        title="Tashtiba | Manege Coupons"
        description="Create and Update Your Coupons"
      />
      <PageBreadcrumb pageTitle={t("couponsPage.title")} userType="admin" />
      <div>
        <SearchTable
          fields={[
            { key: "code", label: "Code", type: "input" },

            {
              key: "status",
              label: "Status",
              type: "select",
              options: [
                { label: "Active", value: "1" },
                { label: "Inactive", value: "0" },
              ],
            },
            {
              key: "type",
              label: "Type",
              type: "select",
              options: [
                { label: "Fixed", value: "fixed" },
                { label: "Percent", value: "percent" },
              ],
            },
            { key: "from_date", label: "From", type: "date" },
            { key: "to_date", label: "To", type: "date" },
          ]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title={t("couponsPage.all")}
          headerAction={t("couponsPage.addNew")}
          href="/admin/coupons/create"
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
            loadingText={t("couponsPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Coupons;
