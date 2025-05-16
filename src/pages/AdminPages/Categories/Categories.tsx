import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/admin/Tables/BasicTable";
import { getCategoriesPaginate } from "../../../api/AdminApi/categoryApi/_requests";
import { useLocation } from "react-router";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
type Category = {};
const Categories = () => {
  const [data, setData] = useState<Category[]>([]);
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
  const { t } = useTranslation(["CategoriesTable"]);
  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: "Role Created Successfully",
        message: location.state.successCreate,
      });
    } else if (location.state?.successEdit) {
      setAlertData({
        variant: "success",
        title: "Role Updated Successfully",
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
        ...Object.fromEntries(
          Object.entries(searchValues).filter(([_, value]) => value !== "")
        ),
      };
      const response = await getCategoriesPaginate(params);
      const responseData = response.data.data;

      const fetchedData = responseData.original?.data || [];

      setData(fetchedData);

      const perPage = responseData.original?.per_page || 0;

      return {
        data: fetchedData,
        last_page: responseData.original?.last_page || 0,
        total: responseData.original?.total || 0,
        next_page_url: responseData.original?.next_page_url,
        prev_page_url: responseData.original?.prev_page_url,
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

  const handleSearch = (key: string, value: string | number) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };

  // const handleDelete = async (id: number) => {
  //   const confirmed = await alertDelete(
  //     id,
  //     deleteBrand,
  //     () => fetchData(pageIndex),
  //     {
  //       confirmTitle: "Delete Role?",
  //       confirmText: "This action cannot be undone!",
  //       confirmButtonText: "Yes, delete",
  //       successTitle: "Deleted!",
  //       successText: "Role has been deleted.",
  //       errorTitle: "Error",
  //       errorText: "Could not delete the Role.",
  //     }
  //   );
  //   setReload((prev) => prev + 1);
  // };
  const columns = buildColumns<Category>({
    includeImageAndNameCell: true,
    includeStatus: true,
    includeUpdatedAt: true,
    includeCreatedAt: true,
    includeActions: false,
    includeCommissionRate: true,
  });

  return (
    <>
      <PageMeta
        title="Tashtiba | Categories"
        description="Show all Categories"
      />
      <PageBreadcrumb pageTitle={t("categoriesPage.title")} userType="admin" />
      <div>
        <SearchTable
          fields={[{ key: "name", label: "Name", type: "input" }]}
          setSearchParam={handleSearch}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard title={t("categoriesPage.all")}>
          <BasicTable
            columns={columns}
            fetchData={fetchData}
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
            searchValueName={searchValues.name}
            loadingText={t("categoriesPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Categories;
