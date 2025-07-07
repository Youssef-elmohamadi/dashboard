import PageMeta from "../../../components/common/SEO/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTableTS";
import { useEffect, useState } from "react";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns"; // مكان الملف
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
import { openChangeStatusModal } from "../../../components/SuperAdmin/Tables/ChangeStatusModal";
import { useTranslation } from "react-i18next";
import {
  useChangeVendorStatus,
  useGetVendorsPaginate,
} from "../../../hooks/Api/SuperAdmin/useVendorMangement/useSuperAdminVendorManage";
import { AxiosError } from "axios";
import { SearchValues } from "../../../types/Vendor";

const Vendors = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [searchValues, setSearchValues] = useState<SearchValues>({
    name: "",
    email: "",
    phone: "",
  });
  const { t } = useTranslation(["VendorsTable"]);
  const handleSearch = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };

  const { data, isLoading, isError, error } = useGetVendorsPaginate(
    pageIndex,
    searchValues
  );

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setUnauthorized(true);
      } else if (status === 500) {
        setGlobalError(true);
      } else {
        setGlobalError(true);
      }
    }
  }, [isError, error]);
  const pageSize = data?.per_page ?? 15;
  const vendorsData = data?.data ?? [];
  const totalVendors = data?.total ?? 0;

  const handleGetStatus = (id: number) => {
    const item = vendorsData?.find((el: any) => el.id === id);
    return item?.status;
  };

  const { mutateAsync: changeStatus } = useChangeVendorStatus();

  const handleChangeStatus = async (id: number) => {
    await openChangeStatusModal({
      id,
      getStatus: handleGetStatus,
      changeStatus: async (id, data) => {
        return await changeStatus({ id, data });
      },
      options: {
        Pending: t("vendorsPage.status.pending"),
        Active: t("vendorsPage.status.active"),
        InActive: t("vendorsPage.status.inactive"),
      },
      Texts: {
        title: t("vendorsPage.changeStatus.title"),
        inputPlaceholder: t("vendorsPage.changeStatus.inputPlaceholder"),
        errorSelect: t("vendorsPage.changeStatus.errorSelect"),
        success: t("vendorsPage.changeStatus.success"),
        noChangeMessage: t("vendorsPage.changeStatus.noChangeMessage"),
        errorResponse: t("vendorsPage.changeStatus.errorResponse"),
        confirmButtonText: t("vendorsPage.changeStatus.confirmButtonText"),
        cancelButtonText: t("vendorsPage.changeStatus.cancelButtonText"),
      },
    });
  };

  const columns = buildColumns({
    includeDateOfCreation: true,
    includeVendorEmail: true,
    includeVendorName: true,
    includeVendorPhone: true,
    includeStatus: true,
    includeActions: true,
  });
  return (
    <>
      <PageMeta
        title={t("vendorsPage.mainTitle")}
        description="Manage Your Vendors"
      />
      <PageBreadcrumb
        pageTitle={t("vendorsPage.title")}
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
        <ComponentCard title={t("vendorsPage.all")}>
          <BasicTable
            columns={columns}
            data={vendorsData}
            isShowMore={true}
            onChangeStatus={handleChangeStatus}
            isChangeStatus={true}
            totalItems={totalVendors}
            isLoading={isLoading}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("vendorsPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Vendors;
