import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/admin/Tables/BasicTable";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns"; // مكان الملف
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import {
  cancelOrder,
  getOrdersWithPaginate,
} from "../../../api/AdminApi/ordersApi/_requests";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [reload, setReload] = useState(0);
  const location = useLocation();
  const [unauthorized, setUnauthorized] = useState(false);
  const [searchValues, setSearchValues] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({
    name: "",
    email: "",
    phone: "",
  });
  const handleSearch = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };
  const { t } = useTranslation(["OrdersTable"]);
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
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        setUnauthorized(true);
        setData([]);
      } else {
        console.error("Fetching error:", error);
      }
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

  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: "Admin Created Successfully",
        message: location.state.successCreate,
      });
      window.history.replaceState({}, document.title);
    } else if (location.state?.successEdit) {
      setAlertData({
        variant: "success",
        title: "Admin Updated Successfully",
        message: location.state.successEdit,
      });
      window.history.replaceState({}, document.title);
    }

    const timer = setTimeout(() => {
      setAlertData(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state]);

  const handleCancel = async (id: number) => {
    const confirmed = await alertDelete(
      id,
      cancelOrder,
      () => fetchData(pageIndex),
      {
        confirmTitle: t("ordersPage.cancel.confirmTitle"),
        confirmText: t("ordersPage.cancel.confirmText"),
        confirmButtonText: t("ordersPage.cancel.confirmButtonText"),
        cancelButtonText: t("ordersPage.cancel.cancelButtonText"),
        successTitle: t("ordersPage.cancel.successTitle"),
        successText: t("ordersPage.cancel.successText"),
        errorTitle: t("ordersPage.cancel.errorTitle"),
        errorText: t("ordersPage.cancel.errorText"),
      }
    );
    setReload((prev) => prev + 1);
  };

  const handleShip = async (id: number) => {
    await openShipmentModal(id);
    setReload((prev) => prev + 1);
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
      {alertData && (
        <Alert
          variant={alertData.variant}
          title={alertData.title}
          message={alertData.message}
        />
      )}
      <PageMeta
        title="Tashtiba | Manege Orders"
        description="Show and Manage Your orders"
      />
      <PageBreadcrumb pageTitle={t("ordersPage.title")} userType="admin" />
      <div>
        <SearchTable
          fields={[
            { key: "name", label: "Name", type: "input" },
            { key: "email", label: "Email", type: "input" },
            { key: "phone", label: "Phone", type: "input" },
          ]}
          setSearchParam={handleSearch}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard title={t("ordersPage.all")}>
          <BasicTable
            columns={columns}
            fetchData={fetchData}
            isModalEdit={false}
            isShowMore={true}
            onCancel={handleCancel}
            isCancel={true}
            onShip={handleShip}
            isShipped={true}
            unauthorized={unauthorized}
            setUnauthorized={setUnauthorized}
            onPaginationChange={({ pageIndex }) => setPageIndex(pageIndex)}
            trigger={reload}
            onDataUpdate={(newData) => setData(newData)}
            searchValueName={searchValues.name}
            searchValueEmail={searchValues.email}
            searchValuePhone={searchValues.phone}
            loadingText={t("ordersPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Orders;
