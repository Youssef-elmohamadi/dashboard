import SEO from "../../../components/common/SEO/seo"; // Ensured SEO component is imported
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/admin/Tables/BasicTableTS";
import { useEffect, useState } from "react";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
import {
  useAllOrdersPaginate,
  useCancelOrder,
} from "../../../hooks/Api/Admin/useOrders/useOrders";
import { AxiosError } from "axios";
import { ID } from "../../../types/Common";
import { SearchValuesOrders } from "../../../types/Orders";

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
  const { t } = useTranslation(["OrdersTable", "Meta"]); // Using namespaces here
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
  const handleCancel = async (id: ID) => {
    await alertDelete(id, cancelOrder, refetch, {
      confirmTitle: t("OrdersTable:ordersPage.cancel.confirmTitle"),
      confirmText: t("OrdersTable:ordersPage.cancel.confirmText"),
      confirmButtonText: t("OrdersTable:ordersPage.cancel.confirmButtonText"),
      cancelButtonText: t("OrdersTable:ordersPage.cancel.cancelButtonText"),
      successTitle: t("OrdersTable:ordersPage.cancel.successTitle"),
      successText: t("OrdersTable:ordersPage.cancel.successText"),
      errorTitle: t("OrdersTable:ordersPage.cancel.errorTitle"),
      errorText: t("OrdersTable:ordersPage.cancel.errorText"),
      lastButton: t("OrdersTable:ordersPage.cancel.lastButton"),
    });
  };

  const columns = buildColumns({
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
      <SEO // PageMeta replaced with SEO, and data directly set
        title={{
          ar: " إدارة الطلبات",
          en: "Order Management",
        }}
        description={{
          ar: "صفحة إدارة طلبات العملاء في تشطيبة. عرض، تتبع، وإلغاء الطلبات.",
          en: "Manage customer orders on Tashtiba. View, track, and cancel orders.",
        }}
        keywords={{
          ar: [
            "الطلبات",
            "إدارة الطلبات",
            "تتبع الطلبات",
            "تشطيبة",
            "المبيعات",
            "طلبات العملاء",
          ],
          en: [
            "orders",
            "order management",
            "order tracking",
            "Tashtiba",
            "sales",
            "customer orders",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <PageBreadcrumb
        pageTitle={t("OrdersTable:ordersPage.title")}
        userType="admin"
      />
      <div>
        <SearchTable
          fields={[
            {
              key: "tracking_number",
              label: "Tracking Number",
              type: "input",
            },

            {
              key: "status",
              label: "Status",
              type: "select",
              options: [
                {
                  label: t("OrdersTable:ordersPage.statuses.pending"),
                  value: "pending",
                },
                {
                  label: t("OrdersTable:ordersPage.statuses.paid"),
                  value: "paid",
                },
                {
                  label: t("OrdersTable:ordersPage.statuses.shipped"),
                  value: "shipped",
                },
                {
                  label: t("OrdersTable:ordersPage.statuses.delivered"),
                  value: "delivered",
                },
                {
                  label: t("OrdersTable:ordersPage.statuses.canceled"),
                  value: "cancelled",
                },
              ],
            },
            {
              key: "shipping_status",
              label: "Shipping Status",
              type: "select",
              options: [
                {
                  label: t("OrdersTable:ordersPage.statuses.pending"),
                  value: "pending",
                },
                {
                  label: t("OrdersTable:ordersPage.statuses.shipped"),
                  value: "shipped",
                },
                {
                  label: t("OrdersTable:ordersPage.statuses.delivered"),
                  value: "delivered",
                },
              ],
            },
            {
              key: "from_date",
              label: "From",
              type: "date",
            },
            { key: "to_date", label: "To", type: "date" },
          ]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard title={t("OrdersTable:ordersPage.all")}>
          {" "}
          {/* Added namespace */}
          <BasicTable
            columns={columns}
            data={ordersData}
            totalItems={totalOrders}
            isLoading={isLoading}
            onCancel={handleCancel}
            isShowMore={true}
            invoice={true}
            isCancel={true}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("OrdersTable:ordersPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Orders;
