import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTableTS";
import { useEffect, useState } from "react";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns";
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
import { openChangeStatusModal } from "../../../components/SuperAdmin/Tables/ChangeStatusModal";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { SearchValues } from "../../../types/Product";
import SEO from "../../../components/common/SEO/seo";
import {
  useChangeRequestStatus,
  useGetRequestsQuotationPaginate,
} from "../../../hooks/Api/SuperAdmin/useRequestsQuotation/useSuperAdminRequestQuotationManage";

const RequestQuotation = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<SearchValues>({
    status: "",
    name: "",
  });
  const { t } = useTranslation(["RequestsTable"]);
  const { data, isLoading, isError, error } = useGetRequestsQuotationPaginate(
    pageIndex,
    searchValues
  );

  const pageSize = data?.per_page ?? 15;
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

  const productsData = data?.data ?? [];

  const totalProducts = data?.total ?? 0;
  const handleSearch = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };

  const handleGetStatus = (id: number) => {
    const item = productsData?.find((el: any) => el.id === id);
    return item?.status;
  };
  const { mutateAsync: changeStatus } = useChangeRequestStatus();

  const handleChangeStatus = async (id: number) => {
    await openChangeStatusModal({
      id,
      getStatus: handleGetStatus,
      changeStatus: async (id, data) => {
        return await changeStatus({ id, data });
      },
      options: {
        Pending: t("requestsPage.status.pending"),
        Reviewed: t("requestsPage.status.reviewed"),
        Responded: t("requestsPage.status.responded"),
        Closed: t("requestsPage.status.closed"),
      },
      Texts: {
        title: t("requestsPage.changeStatus.title"),
        inputPlaceholder: t("requestsPage.changeStatus.inputPlaceholder"),
        errorSelect: t("requestsPage.changeStatus.errorSelect"),
        success: t("requestsPage.changeStatus.success"),
        noChangeMessage: t("requestsPage.changeStatus.noChangeMessage"),
        errorResponse: t("requestsPage.changeStatus.errorResponse"),
        confirmButtonText: t("requestsPage.changeStatus.confirmButtonText"),
        cancelButtonText: t("requestsPage.changeStatus.cancelButtonText"),
      },
    });
  };

  const columns = buildColumns({
    includeDateOfCreation: true,
    includeRoleName: true,
    includeEmail: true,
    includeStatus: true,
    includeActions: true,
  });
  return (
    <>
<SEO
        title={{
          ar: "إدارة طلبات التسعير (سوبر أدمن)",
          en: "Request Quotation Management (Super Admin)",
        }}
        description={{
          ar: "صفحة إدارة طلبات التسعير والمقايسات بواسطة المشرف العام في تشطيبة. عرض الطلبات، متابعة الردود، وتغيير حالات الطلب.",
          en: "Manage quotation requests and estimates by Super Admin on Tashtiba. View requests, follow up responses, and manage request statuses.",
        }}
        keywords={{
          ar: [
            "طلبات التسعير",
            "إدارة المقايسات",
            "طلبات العملاء",
            "تشطيبة",
            "سوبر أدمن",
            "تسعير المشاريع",
            "إدارة الطلبات",
          ],
          en: [
            "quotation requests",
            "estimate management",
            "customer requests",
            "Tashtiba",
            "super admin",
            "project pricing",
            "request management",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <PageBreadcrumb
        pageTitle={t("requestsPage.title")}
        userType="super_admin"
      />
      <div>
        <SearchTable
          fields={[
            { key: "name", label: "Name", type: "input" },
            {
              key: "status",
              label: "Status",
              type: "select",
              options: [
                { label: t("requestsPage.status.pending"), value: "pending" },
                { label: t("requestsPage.status.reviewed"), value: "reviewed" },
                {
                  label: t("requestsPage.status.responded"),
                  value: "responded",
                },
                { label: t("requestsPage.status.closed"), value: "closed" },
              ],
            },
          ]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard title={t("requestsPage.title")}>
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
            globalError={globalError}
            loadingText={t("requestsPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default RequestQuotation;
