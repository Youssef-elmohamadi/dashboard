import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/admin/Tables/BasicTableTS";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
import {
  useAllBrandsPaginate,
  useDeleteBrand,
} from "../../../hooks/Api/Admin/useBrands/useBrands";
import Alert from "../../../components/ui/alert/Alert";
import { AxiosError } from "axios";
import { SearchValues } from "../../../types/Brands";
import { ID, TableAlert } from "../../../types/Common";
import SEO from "../../../components/common/SEO/seo";

const Brands = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [searchValues, setSearchValues] = useState<SearchValues>({
    name: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["BrandsTable"]);
  const { data, isLoading, isError, refetch, error } = useAllBrandsPaginate(
    pageIndex,
    searchValues
  );

  const pageSize = data?.per_page ?? 15;
  const brandsData = data?.data ?? [];
  const totalBrands = data?.total ?? 0;

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

  const [alertData, setAlertData] = useState<TableAlert | null>(null);
  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("BrandsTable:brandsPage.createdSuccessTitle"), // Added namespace
        message: t("BrandsTable:brandsPage.createdSuccessMessage", {
          message: location.state.successCreate,
        }), 
      });
      window.history.replaceState({}, document.title);
    } else if (location.state?.successEdit) {
      setAlertData({
        variant: "success",
        title: t("BrandsTable:brandsPage.updatedSuccessTitle"), // Added namespace
        message: t("BrandsTable:brandsPage.updatedSuccessMessage", {
          message: location.state.successEdit,
        }), 
      });
      window.history.replaceState({}, document.title);
    }
    const timer = setTimeout(() => {
      setAlertData(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state, t]); 

  const handleSearch = (key: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };

  const { mutateAsync } = useDeleteBrand();
  const handleDelete = async (id: ID) => {
    await alertDelete(id, mutateAsync, refetch, {
      confirmTitle: t("BrandsTable:brandsPage.delete.confirmTitle"), // Added namespace
      confirmText: t("BrandsTable:brandsPage.delete.confirmText"), // Added namespace
      confirmButtonText: t("BrandsTable:brandsPage.delete.confirmButtonText"), // Added namespace
      cancelButtonText: t("BrandsTable:brandsPage.delete.cancelButtonText"), // Added namespace
      successTitle: t("BrandsTable:brandsPage.delete.successTitle"), // Added namespace
      successText: t("BrandsTable:brandsPage.delete.successText"), // Added namespace
      errorTitle: t("BrandsTable:brandsPage.delete.errorTitle"), // Added namespace
      errorText: t("BrandsTable:brandsPage.delete.errorText"), // Added namespace
      lastButton: t("BrandsTable:brandsPage.delete.lastButton"), // Added namespace
    });
  };

  const columns = buildColumns({
    includeImageAndNameCell: true,
    includeStatus: true,
    includeUpdatedAt: true,
    includeCreatedAt: true,
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
      <SEO
        title={{
          ar: "تشطيبة - إدارة الماركات",
          en: "Tashtiba - Brand Management",
        }}
        description={{
          ar: "صفحة إدارة الماركات والبراندات في تشطيبة. عرض، إضافة، تعديل، وحذف الماركات.",
          en: "Manage product brands on Tashtiba. View, add, edit, and delete brands.",
        }}
        keywords={{
          ar: [
            "الماركات",
            "إدارة الماركات",
            "البراندات",
            "تشطيبة",
            "إدارة المتجر",
            "المنتجات",
            "الشركات",
          ],
          en: [
            "brands",
            "brand management",
            "product brands",
            "Tashtiba",
            "store management",
            "companies",
          ],
        }}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/admin/brands" }, // Updated href to be specific for brands page
          { lang: "en", href: "https://tashtiba.com/en/admin/brands" }, // Updated href to be specific for brands page
          // { lang: "x-default", href: "https://tashtiba.com/en" }, // Removed this as it was a generic homepage example
        ]}
        robotsTag="noindex, nofollow"
      />
      <PageBreadcrumb
        pageTitle={t("BrandsTable:brandsPage.title")}
        userType="admin"
      />{" "}
      
      <div>
        <SearchTable
          fields={[
            { key: "name", label: "Name", type: "input" },
          ]} 
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title={t("BrandsTable:brandsPage.all")} 
          headerAction={t("BrandsTable:brandsPage.addNew")} 
          href="/admin/brands/create"
        >
          <BasicTable
            columns={columns}
            data={brandsData}
            totalItems={totalBrands}
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={() => {}}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("BrandsTable:brandsPage.table.loadingText")} 
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Brands;
