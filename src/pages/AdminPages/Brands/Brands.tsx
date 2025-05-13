import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/admin/Tables/BasicTable";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import TableActions from "../../../components/admin/Tables/TablesActions";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  deleteBrand,
  getBrandsPaginate,
} from "../../../api/AdminApi/brandsApi/_requests";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
type Brand = {};
const Brands = () => {
  const [reload, setReload] = useState(0);
  const [data, setData] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Brand | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);
  const [searchValues, setSearchValues] = useState<{
    name: string;
  }>({
    name: "",
  });
  const location = useLocation();
  const { t } = useTranslation(["BrandsTable"]);
  const handleSearch = (key: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };
  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("brandsPage.createdSuccess"),
        message: location.state.successCreate,
      });
    } else if (location.state?.successEdit) {
      setAlertData({
        variant: "success",
        title: t("brandsPage.updatedSuccess"),
        message: location.state.successEdit,
      });
    }
    const timer = setTimeout(() => {
      setAlertData(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state]);

  const fetchData = async (pageIndex: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        page: pageIndex + 1,
        name: searchValues.name || undefined,
      };
      const response = await getBrandsPaginate(params);
      const responseData = response.data;

      const fetchedData = Array.isArray(responseData.data.data)
        ? responseData.data.data
        : [];

      setData(fetchedData);
      const perPage = responseData.data.per_page || 0;

      return {
        data: fetchedData,
        last_page: responseData.data.last_page || 0,
        total: responseData.data.total || 0,
        next_page_url: responseData.data.next_page_url,
        prev_page_url: responseData.data.prev_page_url,
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

  const handleDelete = async (id: number) => {
    const confirmed = await alertDelete(
      id,
      deleteBrand,
      () => fetchData(pageIndex),
      {
        confirmTitle: t("brandsTable.delete.confirmTitle"),
        confirmText: t("brandsTable.delete.confirmText"),
        confirmButtonText: t("brandsTable.delete.confirmButtonText"),
        cancelButtonText: t("brandsTable.delete.cancelButtonText"),
        successTitle: t("brandsTable.delete.successTitle"),
        successText: t("brandsTable.delete.successText"),
        errorTitle: t("brandsTable.delete.errorTitle"),
        errorText: t("brandsTable.delete.errorText"),
      }
    );
    setReload((prev) => prev + 1);
  };

  const columns = buildColumns<Brand>({
    includeBrandName: false,
    includeImageAndNameCell: true,
    includeEmail: false,
    includeRoles: false,
    includeStatus: true,
    includeUpdatedAt: true,
    includeCreatedAt: true,
    includeActions: true,
  });
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle={t("brandsPage.title")} userType="admin" />
      <div>
        <SearchTable
          fields={[{ key: "name", label: "Name", type: "input" }]}
          setSearchParam={handleSearch}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title={t("brandsPage.all")}
          headerAction={t("brandsPage.addNew")}
          href="/admin/brands/create"
        >
          <BasicTable
            columns={columns}
            fetchData={fetchData}
            onDelete={handleDelete}
            unauthorized={unauthorized}
            setUnauthorized={setUnauthorized}
            onEdit={(id) => {
              const role = data.find((item) => item.id === id);
              if (role) {
                setSelectedRole(role);
                setIsModalOpenEdit(true);
              }
            }}
            isModalEdit={false}
            onPaginationChange={({ pageIndex }) => setPageIndex(pageIndex)}
            trigger={reload}
            onDataUpdate={(newData) => setData(newData)}
            searchValueName={searchValues.name}
            loadingText={t("brandsPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Brands;
