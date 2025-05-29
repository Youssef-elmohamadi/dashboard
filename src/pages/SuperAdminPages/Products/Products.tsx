import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTableTS";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns"; // مكان الملف
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
import { getProductById } from "../../../api/SuperAdminApi/Products/_requests";
import { openChangeStatusModal } from "../../../components/SuperAdmin/Tables/ChangeStatusModal";
import { useTranslation } from "react-i18next";
import {
  useChangeProductStatus,
  useGetProductsPaginate,
} from "../../../hooks/useSuperAdminProductsManage";
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
  const [pageIndex, setPageIndex] = useState(0);
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
  const location = useLocation();
  const { t } = useTranslation(["ProductsTable"]);
  const { data, isLoading, isError, refetch, error } = useGetProductsPaginate(
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

  const productsData = data?.data ?? [];
  const totalProducts = data?.total ?? 0;
  const handleSearch = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
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

  const getStatus = async (id) => {
    const res = await getProductById(id);
    return res.data.data.status;
  };
  const { mutateAsync: changeStatus } = useChangeProductStatus();

  const handleChangeStatus = async (id: number) => {
    await openChangeStatusModal({
      id,
      getStatus,
      changeStatus: async (id, data) => {
        return await changeStatus({ id, data });
      },
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
      <PageBreadcrumb
        pageTitle={t("productsPage.title")}
        userType="super_admin"
      />
      <div>
        <SearchTable
          fields={[
            { key: "name", label: "Name", type: "input" },
            { key: "email", label: "Email", type: "input" },
            { key: "phone", label: "Phone", type: "input" },
          ]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard title={t("productsPage.title")}>
          <BasicTable
            columns={columns}
            data={productsData}
            totalItems={totalProducts}
            isLoading={isLoading}
            isShowMore={true}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onChangeStatus={handleChangeStatus}
            isChangeStatus={true}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            loadingText={t("productsPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Products;
