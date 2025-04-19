import React, { useEffect, useState } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import ProductsTable from "../../../components/admin/Products/ProductsTable";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import TableActions from "../../../components/admin/Tables/TablesActions";
import {
  deleteProduct,
  getProductsPaginate,
} from "../../../api/products/_requests";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import BasicTable from "../../../components/admin/Tables/BasicTable";
import { useLocation } from "react-router";
type Product = {};
const Products = () => {
  const [reload, setReload] = useState(0);
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);
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

  const fetchData = async (pageIndex: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProductsPaginate(pageIndex + 1);
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
      console.error("Error fetching Roles:", error);
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
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Products;
