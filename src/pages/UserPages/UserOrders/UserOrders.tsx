import PageMeta from "../../../components/common/PageMeta";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/EndUser/Table/BasicTableTS";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import { buildOrderColumns } from "../../../components/EndUser/Table/_Colmuns"; // مكان الملف
import { useTranslation } from "react-i18next";
import {
  useAllOrdersPaginate,
  useCancelOrder,
} from "../../../hooks/Api/EndUser/useOrders/useOrders";
import { AxiosError } from "axios";

const Orders = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch, error } =
    useAllOrdersPaginate(pageIndex);
  const pageSize = data?.per_page ?? 15;
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

  const ordersData = data?.data ?? [];
  const totalOrders = data?.total ?? 0;
  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (!token) {
      navigate("/signin", { replace: true });
    }
  }, []);
  const { t } = useTranslation(["EndUserOrderHistory"]);
  const { mutateAsync: cancelOrder } = useCancelOrder();
  const handleCancel = async (id: number) => {
    await alertDelete(id, cancelOrder, refetch, {
      confirmTitle: t("cancelAlert.cancelTitle"),
      confirmText: t("cancelAlert.cancelText"),
      confirmButtonText: t("cancelAlert.confirmButtonText"),
      cancelButtonText: t("cancelAlert.cancelButtonText"),
      successTitle: t("cancelAlert.successTitle"),
      successText: t("cancelAlert.successText"),
      errorTitle: t("cancelAlert.errorTitle"),
      errorText: t("cancelAlert.errorText"),
    });
  };

  const columns = buildOrderColumns({
    includeOrderStatus: true, // Enable the Order Status column
    includeActions: true, // Optionally include actions
    includeCreatedAt: true,
    includeShippedStatus: true,
    includeTotalPrice: true,
  });
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="space-y-6">
        <ComponentCard
          title={t("ordersTable.title")}
          className="dark:!border-gray-200 dark:!text-gray-900"
        >
          <BasicTable
            columns={columns}
            data={ordersData}
            totalItems={totalOrders}
            isLoading={isLoading}
            onCancel={handleCancel}
            isShowMore={true}
            isCancel={true}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("ordersTable.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Orders;
