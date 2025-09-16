import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTableTS";
import { useEffect, useState } from "react";
import { alertDelete } from "../../../components/SuperAdmin/Tables/Alert";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns";
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
import { openShipmentModal } from "../../../components/SuperAdmin/ordersTable/ShipmentModal";
import { useTranslation } from "react-i18next";
import {
  useAllOrdersPaginate,
  useCancelOrder,
  useShipOrder,
} from "../../../hooks/Api/SuperAdmin/useOrders/useOrders";
import { AxiosError } from "axios";
import { SearchValuesOrders } from "../../../types/Orders";
import SEO from "../../../components/common/SEO/seo";

const Orders = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [searchValues, setSearchValues] = useState<SearchValuesOrders>({
    status: "",
    shipping_status: "",
    tracking_number: "",
    from_date: "",
    to_date: "",
  });

  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const { t } = useTranslation(["OrdersTable", "Meta"]);
  const { data, isLoading, isError, refetch, error } = useAllOrdersPaginate(
    pageIndex,
    searchValues
  );
  
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
  const handleSearch = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };
  const { mutateAsync: cancelOrder } = useCancelOrder();
  const handleCancel = async (id: number) => {
    await alertDelete(id, cancelOrder, refetch, {
      confirmTitle: t("ordersPage.cancel.confirmTitle"),
      confirmText: t("ordersPage.cancel.confirmText"),
      confirmButtonText: t("ordersPage.cancel.confirmButtonText"),
      cancelButtonText: t("ordersPage.cancel.cancelButtonText"),
      successTitle: t("ordersPage.cancel.successTitle"),
      successText: t("ordersPage.cancel.successText"),
      errorTitle: t("ordersPage.cancel.errorTitle"),
      errorText: t("ordersPage.cancel.errorText"),
      lastButton: t("ordersPage.cancel.lastButton"),
    });
  };
  const { mutateAsync: shipment } = useShipOrder();
  const handleShip = async (id: number) => {
    await openShipmentModal(id, shipment);
  };

  const columns = buildColumns({
    includeFullName: true,
    includeDateOfCreation: true,
    includeStatus: true,
    includeTotalPrice: true,
    includePaymentMethod: true,
    includeActions: true,
  });
  return (
    <>
      <SEO
        title={{
          ar: " إدارة الطلبات (سوبر أدمن)",
          en: "Order Management (Super Admin)",
        }}
        description={{
          ar: "صفحة إدارة طلبات العملاء بواسطة المشرف العام في تشطيبة. عرض، تتبع، وإلغاء الطلبات.",
          en: "Manage customer orders by Super Admin on Tashtiba. View, track, and cancel orders.",
        }}
        keywords={{
          ar: [
            "طلبات المشرف العام",
            "إدارة الطلبات",
            "تتبع الطلبات",
            "تشطيبة",
            "سوبر أدمن",
            "المبيعات",
          ],
          en: [
            "super admin orders",
            "order management",
            "order tracking",
            "Tashtiba",
            "super admin",
            "sales",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <PageBreadcrumb pageTitle={t("ordersPage.title")} userType="admin" />
      <div>
        <SearchTable
          fields={[
            { key: "tracking_number", label: "Tracking Number", type: "input" },

            {
              key: "status",
              label: "Status",
              type: "select",
              options: [
                { label: t("ordersPage.statuses.pending"), value: "pending" },
                { label: t("ordersPage.statuses.paid"), value: "paid" },
                { label: t("ordersPage.statuses.shipped"), value: "shipped" },
                {
                  label: t("ordersPage.statuses.delivered"),
                  value: "delivered",
                },
                {
                  label: t("ordersPage.statuses.canceled"),
                  value: "cancelled",
                },
              ],
            },
            {
              key: "shipping_status",
              label: "Shipping Status",
              type: "select",
              options: [
                { label: t("ordersPage.statuses.pending"), value: "pending" },
                { label: t("ordersPage.statuses.shipped"), value: "shipped" },
                {
                  label: t("ordersPage.statuses.delivered"),
                  value: "delivered",
                },
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
        <ComponentCard title={t("ordersPage.all")}>
          <BasicTable
            columns={columns}
            data={ordersData}
            totalItems={totalOrders}
            isLoading={isLoading}
            onCancel={handleCancel}
            onShip={handleShip}
            isShowMore={true}
            isCancel={true}
            isShipped={true}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("ordersPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Orders;
