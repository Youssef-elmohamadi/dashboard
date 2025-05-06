import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { buildColumns } from "../../../components/SuperAdmin/Tables/_Colmuns";
import TableActions from "../../../components/SuperAdmin/Tables/TablesActions";
import {
  deleteCategory,
  getCategoriesPaginate,
} from "../../../api/SuperAdminApi/Categories/_requests";
import { alertDelete } from "../../../components/SuperAdmin/Tables/Alert";
import BasicTable from "../../../components/SuperAdmin/Tables/BasicTable";
import { useLocation } from "react-router";
import SearchTable from "../../../components/SuperAdmin/Tables/SearchTable";
type Product = {};
const Categories = () => {
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const location = useLocation();

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

  //   useEffect(() => {
  //     const fetchCategories = async () => {
  //       try {
  //         const response = await getAllCategories();
  //         if (response.data) setCategories(response.data.data.original);
  //       } catch (error) {
  //         console.error("Error fetching categories:", error);
  //       }
  //     };
  //     fetchCategories();
  //   }, []);

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
      const response = await getCategoriesPaginate(params);
      const responseData = response.data.data.original;
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
      };
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
      deleteCategory,
      () => fetchData(pageIndex),
      {
        confirmTitle: "Delete Role?",
        confirmText: "This action cannot be undone!",
        confirmButtonText: "Yes, delete",
        successTitle: "Deleted!",
        successText: "Role has been deleted.",
        errorTitle: "Error",
        errorText: "Could not delete the Role.",
      }
    );
    setReload((prev) => prev + 1);
  };

  const columns = buildColumns<Product>({
    includeImagesAndNameCell: true,
    includeStatus: true,
    includeDateOfCreation: true,
    includeActions: true,
    includeCommissionRate: true,
    onDelete: (id) => console.log("delete", id),
    customActionsRenderer: (row) => (
      <TableActions
        id={row.id}
        rowData={row}
        isShowMore={true}
        onDelete={handleDelete}
      />
    ),
  });

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Products" />
      <div>
        <SearchTable
          fields={[{ key: "name", label: "Name", type: "input" }]}
          setSearchParam={handleSearch}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title="All Categories"
          headerAction="Add New Category"
          href="/super_admin/categories/create"
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
            loadingText="Products data Loading"
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Categories;
