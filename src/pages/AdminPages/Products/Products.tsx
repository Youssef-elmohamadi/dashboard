import { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import TableActions from "../../../components/admin/Tables/TablesActions";
import {
  deleteProduct,
  getProductsPaginate,
} from "../../../api/AdminApi/products/_requests";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import BasicTable from "../../../components/admin/Tables/BasicTable";
import { useLocation } from "react-router";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { getAllBrands } from "../../../api/AdminApi/brandsApi/_requests";
import { getAllCategories } from "../../../api/AdminApi/categoryApi/_requests";
type Product = {};
const Products = () => {
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.data) setCategories(response.data.data.original);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        if (response.data) setBrands(response.data.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);
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
      const response = await getProductsPaginate(params);
      const responseData = response.data;

      const fetchedData = Array.isArray(responseData.data.data)
        ? responseData.data.data
        : [];
      console.log(responseData.data.data);
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
      deleteProduct,
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
    includeBrandName: false,
    includeImagesAndNameCell: true,
    includeEmail: false,
    includeRoles: false,
    includeStatus: true,
    includeUpdatedAt: true,
    includeCreatedAt: true,
    includeActions: true,
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
          fields={[
            { key: "name", label: "Name", type: "input" },
            {
              key: "category_id",
              label: "Category",
              type: "select",
              options: categories.map((category) => ({
                label: category.name,
                value: category.id,
              })),
            },
            {
              key: "brand_id",
              label: "Brand",
              type: "select",
              options: brands.map((brand) => ({
                label: brand.name,
                value: brand.id,
              })),
            },
            {
              key: "status",
              label: "Status",
              type: "select",
              options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
            },
          ]}
          setSearchParam={handleSearch}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title="All Products"
          headerAction="Add New Products"
          href="/admin/products/create"
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
            isShowMore={true}
            isModalEdit={false}
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

export default Products;
