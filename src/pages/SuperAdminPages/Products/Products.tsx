import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTable";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns"; // مكان الملف
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
import {
  cancelOrder,
  getProductsWithPaginate,
  changeStatus,
  getProductById,
} from "../../../api/SuperAdminApi/Products/_requests";
import { openChangeStatusModal } from "../../../components/SuperAdmin/Tables/ChangeStatusModal";
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

const Products = () => {
  const [data, setData] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
  const { t } = useTranslation(["ProductsTable"]);
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

      const response = await getProductsWithPaginate(params);
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
        confirmTitle: "Cancel Order?",
        confirmText: "This action cannot be undone!",
        confirmButtonText: "Yes, Cancel",
        successTitle: "Canceled!",
        successText: "Order has been Canceled.",
        errorTitle: "Error",
        errorText: "Could not Cancel The Order.",
      }
    );
    setReload((prev) => prev + 1);
  };

  const getStatus = async (id) => {
    const res = await getProductById(id);
    return res.data.data.status;
  };

  const handleChangeStatus = async (id: number) => {
    await openChangeStatusModal({
      id,
      getStatus,
      changeStatus,
      options: {
        Pending: t("productsPage.status.pending"),
        Active: t("productsPage.status.active"),
        InActive: t("productsPage.status.inactive"),
      },
      Texts: {
        title: t("productsPage.changeStatus.title"),
        inputPlaceholder: t("productsPage.changeStatus.inputPlaceholder"),
        errorSelect: t("productsPage.changeStatus.errorSelect"),
        success: t("productsPage.changeStatus.success"),
        noChangeMessage: t("productsPage.changeStatus.noChangeMessage"),
        errorResponse: t("productsPage.changeStatus.errorResponse"),
        confirmButtonText: t("productsPage.changeStatus.confirmButtonText"),
        cancelButtonText: t("productsPage.changeStatus.cancelButtonText"),
      },
    });

    setReload((prev) => prev + 1);
  };

  const columns = buildColumns<User>({
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
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle={t("productsPage.title")} userType="super_admin" />
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
        <ComponentCard title={t("productsPage.title")}>
          <BasicTable
            columns={columns}
            fetchData={fetchData}
            onPaginationChange={({ pageIndex }) => setPageIndex(pageIndex)}
            trigger={reload}
            isShowMore={true}
            onChangeStatus={handleChangeStatus}
            isChangeStatus={true}
            unauthorized={unauthorized}
            setUnauthorized={setUnauthorized}
            onDataUpdate={(newData) => setData(newData)}
            searchValueName={searchValues.name}
            searchValueEmail={searchValues.email}
            searchValuePhone={searchValues.phone}
            loadingText={t("productsPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Products;
