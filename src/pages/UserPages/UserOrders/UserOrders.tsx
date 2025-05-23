import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/EndUser/Table/BasicTable";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { deleteAdmin } from "../../../api/AdminApi/usersApi/_requests";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import { buildOrderColumns } from "../../../components/EndUser/Table/_Colmuns"; // مكان الملف
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import {
  cancelOrder,
  getOrdersWithPaginate,
} from "../../../api/EndUserApi/endUserOrders/_requests";
import { openShipmentModal } from "../../../components/admin/ordersTable/ShipmentModal";
import { useTranslation } from "react-i18next";
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
  const [data, setData] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [reload, setReload] = useState(0);
  const location = useLocation();
  const [searchValues, setSearchValues] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({
    name: "",
    email: "",
    phone: "",
  });
  const { t } = useTranslation(["EndUserOrderHistory"]);
  const handleSearch = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };

  const fetchData = async (pageIndex: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        page: pageIndex + 1,
        ...Object.fromEntries(
          Object.entries(searchValues).filter(([_, value]) => value !== "")
        ),
      };

      const response = await getOrdersWithPaginate(params);
      const responseData = response.data.data;
      console.log(responseData);

      const fetchedData = Array.isArray(responseData.data)
        ? responseData.data
        : [];

      const perPage = responseData.per_page || 5;

      return {
        data: fetchedData,
        last_page: responseData.last_page || 0,
        total: responseData.total || 0,
        next_page_url: responseData.next_page_url,
        prev_page_url: responseData.prev_page_url,
        perPage,
      };
    } catch (error) {
      console.error("Error fetching admins:", error);
      return {
        data: [],
        last_page: 0,
        total: 0,
        next_page_url: null,
        prev_page_url: null,
        perPage: 0,
      };
    } finally {
      setLoading(false);
    }
  };

  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);

  const handleCancel = async (id: number) => {
    const confirmed = await alertDelete(
      id,
      cancelOrder,
      () => fetchData(pageIndex),
      {
        confirmTitle: t("cancelAlert.cancelTitle"),
        confirmText: t("cancelAlert.cancelText"),
        confirmButtonText: t("cancelAlert.confirmButtonText"),
        cancelButtonText: t("cancelAlert.cancelButtonText"),
        successTitle: t("cancelAlert.successTitle"),
        successText: t("cancelAlert.successText"),
        errorTitle: t("cancelAlert.errorTitle"),
        errorText: t("cancelAlert.errorText"),
      }
    );
    setReload((prev) => prev + 1);
  };

  const handleShip = async (id: number) => {
    await openShipmentModal(id);
    setReload((prev) => prev + 1);
  };

  const columns = buildOrderColumns<User>({
    includeOrderStatus: true, // Enable the Order Status column
    includeActions: true, // Optionally include actions
    includeCreatedAt: true,
    includeShippedStatus: true,
    includeTotalPrice: true,
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
            fetchData={fetchData}
            isShowMore={true}
            onCancel={handleCancel}
            isCancel={true}
            isShipped={true}
            onPaginationChange={({ pageIndex }) => setPageIndex(pageIndex)}
            trigger={reload}
            onDataUpdate={(newData) => setData(newData)}
            loadingText={t("ordersTable.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Orders;
