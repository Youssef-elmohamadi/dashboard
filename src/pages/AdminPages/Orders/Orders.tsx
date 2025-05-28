import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/admin/Tables/BasicTableTS";
import { useEffect, useState } from "react";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns"; // مكان الملف
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { openShipmentModal } from "../../../components/admin/ordersTable/ShipmentModal";
import { useTranslation } from "react-i18next";
import {
  useAllOrdersPaginate,
  useCancelOrder,
  useShipOrder,
} from "../../../hooks/useOrders";
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

const Orders = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [searchValues, setSearchValues] = useState<{
    status: string;
    shipping_status: string;
    tracking_number: string;
    from_date: string;
    to_date: string;
  }>({
    status: "",
    shipping_status: "",
    tracking_number: "",
    from_date: "",
    to_date: "",
  });

  const [unauthorized, setUnauthorized] = useState(false);
  const { t } = useTranslation(["OrdersTable"]);
  const { data, isLoading, isError, refetch, error } = useAllOrdersPaginate(
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
    const confirmed = await alertDelete(id, cancelOrder, refetch, {
      confirmTitle: t("ordersPage.cancel.confirmTitle"),
      confirmText: t("ordersPage.cancel.confirmText"),
      confirmButtonText: t("ordersPage.cancel.confirmButtonText"),
      cancelButtonText: t("ordersPage.cancel.cancelButtonText"),
      successTitle: t("ordersPage.cancel.successTitle"),
      successText: t("ordersPage.cancel.successText"),
      errorTitle: t("ordersPage.cancel.errorTitle"),
      errorText: t("ordersPage.cancel.errorText"),
    });
  };
  const { mutateAsync: shipment } = useShipOrder();
  const handleShip = async (id: number) => {
    await openShipmentModal(id, shipment);
  };

  const columns = buildColumns<User>({
    includeFullName: true,
    includeCreatedAt: true,
    includeOrderStatus: true,
    includeStatus: true,
    includeTotalPrice: true,
    includePaymentMethod: true,
    includeActions: true,
  });
  return (
    <>
      <PageMeta
        title="Tashtiba | Manege Orders"
        description="Show and Manage Your orders"
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
                { label: "Pending", value: "pending" },
                { label: "Paid", value: "paid" },
                { label: "Shipped", value: "shipped" },
                { label: "Delivered", value: "delivered" },
                { label: "Cancelled", value: "cancelled" },
              ],
            },
            {
              key: "shipping_status",
              label: "Shipping Status",
              type: "select",
              options: [
                { label: "Pending", value: "pending" },
                { label: "Shipped", value: "shipped" },
                { label: "Delivered", value: "delivered" },
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
            loadingText={t("ordersPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Orders;
