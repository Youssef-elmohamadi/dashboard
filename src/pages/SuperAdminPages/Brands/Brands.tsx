import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTableTS";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns"; // مكان الملف
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
import { getBrandById } from "../../../api/SuperAdminApi/Brands/_requests";
import { openChangeStatusModal } from "../../../components/SuperAdmin/Tables/ChangeStatusModal";
import { useTranslation } from "react-i18next";
import { useAllBrandsPaginate } from "../../../hooks/useBrands";
import { useChangeBrandStatus } from "../../../hooks/useSuperAdminBrandsManage";
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

const Brands = () => {
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
  const { t } = useTranslation(["BrandsTable"]);
  const { data, isLoading, isError, refetch, error } = useAllBrandsPaginate(
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

  const brandsData = data?.data ?? [];
  const totalBrands = data?.total ?? 0;
  const [reload, setReload] = useState(0);
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
    const res = await getBrandById(id);
    return res.data.data.status;
  };
  const { mutateAsync: changeStatus } = useChangeBrandStatus();
  const handleChangeStatus = async (id: number) => {
    await openChangeStatusModal({
      id,
      getStatus,
      changeStatus: async (id, data) => {
        return await changeStatus({ id, data });
      },
      options: {
        Pending: t("brandsPage.status.pending"),
        Active: t("brandsPage.status.active"),
        InActive: t("brandsPage.status.inactive"),
      },
      Texts: {
        title: t("brandsPage.changeStatus.title"),
        inputPlaceholder: t("brandsPage.changeStatus.inputPlaceholder"),
        errorSelect: t("brandsPage.changeStatus.errorSelect"),
        success: t("brandsPage.changeStatus.success"),
        noChangeMessage: t("brandsPage.changeStatus.noChangeMessage"),
        errorResponse: t("brandsPage.changeStatus.errorResponse"),
        confirmButtonText: t("brandsPage.changeStatus.confirmButtonText"),
        cancelButtonText: t("brandsPage.changeStatus.cancelButtonText"),
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
        pageTitle={t("brandsPage.title")}
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
        <ComponentCard title={t("brandsPage.all")}>
          <BasicTable
            columns={columns}
            data={brandsData}
            totalItems={totalBrands}
            isLoading={isLoading}
            isShowMore={true}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onChangeStatus={handleChangeStatus}
            isChangeStatus={true}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            loadingText={t("brandsPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Brands;
