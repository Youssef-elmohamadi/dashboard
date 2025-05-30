import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns";
import { alertDelete } from "../../../components/SuperAdmin/Tables/Alert";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTableTS";
import { useLocation } from "react-router";
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
import Alert from "../../../components/ui/alert/Alert";
import {
  useBannersWithPaginate,
  useDeleteBanner,
} from "../../../hooks/useSuperAdminBanners";
import { useAllCategories } from "../../../hooks/useCategories";
const Banners = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [searchValues, setSearchValues] = useState<{
    category_id: string;
    brand_id: string;
    status: string;
    name: string;
  }>({
    category_id: "",
    brand_id: "",
    status: "",
    name: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["BannersTable"]);
  const { data, isLoading, isError, refetch, error } = useBannersWithPaginate(
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
  
  const bannersData = data?.data.data ?? [];
  const totalBanners = data?.data?.total ?? 0;

  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("bannersPage.createdSuccess"),
        message: location.state.successCreate,
      });
    } else if (location.state?.successEdit) {
      setAlertData({
        variant: "success",
        title: t("bannersPage.updatedSuccess"),
        message: location.state.successEdit,
      });
    }
    const timer = setTimeout(() => {
      setAlertData(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state]);

    const { data: allCategories } = useAllCategories();
    const categories = allCategories?.data.data?.original;

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await getAllCategories();
  //       if (response.data) setCategories(response.data.data.original);
  //     } catch (error) {
  //       console.error("Error fetching Banners:", error);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  const handleSearch = (key: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };
  const { mutateAsync: deleteBannerMutate } = useDeleteBanner();

  const handleDelete = async (id: number) => {
    const confirmed = await alertDelete(id, deleteBannerMutate, refetch, {
      confirmTitle: t("bannersPage.delete.confirmTitle"),
      confirmText: t("bannersPage.delete.confirmText"),
      confirmButtonText: t("bannersPage.delete.confirmButtonText"),
      successTitle: t("bannersPage.delete.successTitle"),
      successText: t("bannersPage.delete.successText"),
      errorTitle: t("bannersPage.delete.errorTitle"),
      errorText: t("bannersPage.delete.errorText"),
    });
  };

  const columns = buildColumns({
    includeTitle: true,
    includeDateOfCreation: true,
    includeIsActive: true,
    includePosition: true,
    includeActions: true,
    categories: categories,
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
        pageTitle={t("bannersPage.title")}
        userType="super_admin"
      />
      <div>
        <SearchTable
          fields={[{ key: "name", label: "Name", type: "input" }]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title={t("bannersPage.all")}
          headerAction={t("bannersPage.addNew")}
          href="/super_admin/banners/create"
        >
          <BasicTable
            columns={columns}
            data={bannersData}
            totalItems={totalBanners}
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={() => {}}
            isShowMore={true}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            loadingText={t("bannersPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Banners;
