import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTableTS";
import { useEffect, useState } from "react";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";  
import SEO from "../../../components/common/SEO/seo";
import { useDeleteTransportationPrice, useGetTransportationPrices } from "../../../hooks/Api/SuperAdmin/useTransports/useSuperAdminTransports";
import { alertDelete } from "../../../components/SuperAdmin/Tables/Alert";

const Transport = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<boolean>(false);
  // const [searchValues, setSearchValues] = useState<SearchValues>({
  //   category_id: "",
  //   brand_id: "",
  //   status: "",
  //   name: "",
  // });
  const { t } = useTranslation(["TransportTable"]);
  const { data, isLoading, isError,refetch, error } = useGetTransportationPrices(
    pageIndex,
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

  const transportationPricesData = data?.data.data ?? [];

  const totalProducts = data?.total ?? 0;

    const { mutateAsync: deletePrice } = useDeleteTransportationPrice();
    
  
    const handleDelete = async (id: number) => {
      await alertDelete(id, deletePrice, refetch, {
        confirmTitle: t("transportPage.delete.confirmTitle"),
        confirmText: t("transportPage.delete.confirmText"),
        confirmButtonText: t("transportPage.delete.confirmButtonText"),
        successTitle: t("transportPage.delete.successTitle"),
        successText: t("transportPage.delete.successText"),
        errorTitle: t("transportPage.delete.errorTitle"),
        errorText: t("transportPage.delete.errorText"),
        cancelButtonText: t("transportPage.delete.cancelButtonText"),
      });
    };
  const columns = buildColumns({
    includeVehicleType: true,
    includeArea: true,
    includeFixedPrice: true,
    includeActions: true,
  });
  return (
    <>
      <SEO
        title={{
          ar: " إدارة اسعار النقل (سوبر أدمن)",
          en: "Transport Pricing Management (Super Admin)",
        }}
        description={{
          ar: "صفحة إدارة اسعار النقل بواسطة المشرف العام في تشطيبة. عرض، تغيير حالة، والتحكم في اسعار النقل.",
          en: "Manage transport pricing by Super Admin on Tashtiba. View, change status, and control transport pricing.",
        }}
        keywords={{
          ar: [
            "اسعار النقل المشرف العام",
            "إدارة الاسعار ",
            "قائمة الاسعار",
            "تشطيبة",
            "سوبر أدمن",
            "اسعار النقل",
          ],
          en: [
            "super admin transport pricing",
            "transport pricing management",
            "transport list",
            "Tashtiba",
            "super admin",
            "transport pricing",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <PageBreadcrumb
        pageTitle={t("transportPage.title")}
        userType="super_admin"

      />
      <div className="space-y-6">
        <ComponentCard title={t("transportPage.title")} 
          headerAction={t("transportPage.addNew")}
          href="/super_admin/transport/create"
        >
          <BasicTable
            columns={columns}
            data={transportationPricesData}
            totalItems={totalProducts}
            isLoading={isLoading}
            isShowMore={true}
            onDelete={handleDelete}
            onEdit={() => {}}
            pageIndex={pageIndex}
            pageSize={pageSize}
            isChangeStatus={true}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("transportPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Transport;
