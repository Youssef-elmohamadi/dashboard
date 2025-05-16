import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns";
import TableActions from "../../../components/SuperAdmin/Tables/TablesActions";
import {
  getBannersPaginate,
  deleteBanner,
} from "../../../api/SuperAdminApi/Banners/_requests";
import { alertDelete } from "../../../components/SuperAdmin/Tables/Alert";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTable";
import { useLocation } from "react-router";
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
import Alert from "../../../components/ui/alert/Alert";
import { getAllCategories } from "../../../api/SuperAdminApi/Categories/_requests";
type Product = {};
const Banners = () => {
  const [reload, setReload] = useState(0);
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
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

  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Brand[]>([]);
  const location = useLocation();
  const { t } = useTranslation(["BannersTable"]);
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.data) setCategories(response.data.data.original);
      } catch (error) {
        console.error("Error fetching Banners:", error);
      }
    };
    fetchCategories();
  }, []);

  //   useEffect(() => {
  //     const fetchBrands = async () => {
  //       try {
  //         const response = await getAllBrands();
  //         if (response.data) setBrands(response.data.data);
  //       } catch (error) {
  //         console.error("Error fetching brands:", error);
  //       }
  //     };
  //     fetchBrands();
  //   }, []);
  const handleSearch = (key: string, value: string) => {
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
      const response = await getBannersPaginate(params);
      const responseData = response.data.data;
      console.log(responseData);

      const fetchedData = Array.isArray(responseData.data)
        ? responseData.data
        : [];
      console.log(fetchedData);
      setData(fetchedData);
      const perPage = responseData.per_page || 0;

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

  const handleDelete = async (id: number) => {
    const confirmed = await alertDelete(
      id,
      deleteBanner,
      () => fetchData(pageIndex),
      {
        confirmTitle: t("bannersPage.delete.confirmTitle"),
        confirmText: t("bannersPage.delete.confirmText"),
        confirmButtonText: t("bannersPage.delete.confirmButtonText"),
        successTitle: t("bannersPage.delete.successTitle"),
        successText: t("bannersPage.delete.successText"),
        errorTitle: t("bannersPage.delete.errorTitle"),
        errorText: t("bannersPage.delete.errorText"),
      }
    );
    setReload((prev) => prev + 1);
  };

  const columns = buildColumns<Product>({
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
            fetchData={fetchData}
            onDelete={handleDelete}
            onEdit={(id) => {
              const role = data.find((item) => item.id === id);
              if (role) {
                setSelectedRole(role);
                setIsModalOpenEdit(true);
              }
            }}
            isShowMore={true}
            isModalEdit={false}
            unauthorized={unauthorized}
            setUnauthorized={setUnauthorized}
            onPaginationChange={({ pageIndex }) => setPageIndex(pageIndex)}
            trigger={reload}
            onDataUpdate={(newData) => setData(newData)}
            searchValueName={searchValues.name}
            searchValueCategoryId={searchValues.category_id}
            searchValueBrandId={searchValues.brand_id}
            searchValueStatus={searchValues.status}
            loadingText={t("bannersPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Banners;
