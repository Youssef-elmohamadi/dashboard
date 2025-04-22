import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BasicTable from "../../../components/admin/Tables/BasicTable";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllAdminsPaginate } from "../../../api/usersApi/_requests";
import { deleteAdmin } from "../../../api/usersApi/_requests";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns"; // مكان الملف
import TableActions from "../../../components/admin/Tables/TablesActions";
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/admin/Tables/SearchTable";
type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  vendor_id: number;
  avatar: string;
  created_at: string;
  updated_at: string;
  vendor: { id: number; name: string };
  roles: { id: number; name: string }[];
};

const Admins = () => {
  const [data, setData] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [reload, setReload] = useState(0);
  const location = useLocation();
  const [searchValues, setSearchValues] = useState<{
    name: string;
    email: string;
    phone: string;
  }>({
    name: "",
    email: "",
    phone: "",
  });
  const handleSearch = (key: string, value: string | number) => {
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

      const response = await getAllAdminsPaginate(params);
      const responseData = response.data.data;

      const fetchedData = Array.isArray(responseData.data)
        ? responseData.data
        : [];

      const perPage = responseData.per_page || 5;

      return {
        data: fetchedData,
        last_page: responseData.last_page || 0,
        total: responseData.total || 0,
        next_page_url: responseData.next_page_url,
        prev_page_url: responseData.prev_page_url,
        perPage,
      };
    } catch (error) {
      console.error("Error fetching admins:", error);
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

  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: "Admin Created Successfully",
        message: location.state.successCreate,
      });
      window.history.replaceState({}, document.title);
    } else if (location.state?.successEdit) {
      setAlertData({
        variant: "success",
        title: "Admin Updated Successfully",
        message: location.state.successEdit,
      });
      window.history.replaceState({}, document.title);
    }

    const timer = setTimeout(() => {
      setAlertData(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state]);

  const handleDelete = async (id: number) => {
    const confirmed = await alertDelete(
      id,
      deleteAdmin,
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

  const columns = buildColumns<User>({
    includeName: true,
    includeEmail: true,
    includeRoles: true,
    includeCreatedAt: true,
    includeActions: true,
    onDelete: (id) => console.log("delete", id),
    customActionsRenderer: (row) => (
      <TableActions id={row.id} rowData={row} onDelete={handleDelete} />
    ),
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
      <PageBreadcrumb pageTitle="Admins" />
      <div>
        <SearchTable
          fields={[
            { key: "name", label: "Name", type: "input" },
            { key: "email", label: "Email", type: "input" },
            { key: "phone", label: "Phone", type: "input" },
          ]}
          setSearchParam={handleSearch}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title="All Admins"
          headerAction="Add New Admin"
          href="/admin/admins/create"
        >
          <BasicTable
            columns={columns}
            fetchData={fetchData}
            onDelete={handleDelete}
            onEdit={(id) => {
              const admin = data.find((item) => item.id === id);
              if (admin) {
                setSelectedUser(admin);
              }
            }}
            isModalEdit={false}
            onPaginationChange={({ pageIndex }) => setPageIndex(pageIndex)}
            trigger={reload}
            onDataUpdate={(newData) => setData(newData)}
            searchValueName={searchValues.name}
            searchValueEmail={searchValues.email}
            searchValuePhone={searchValues.phone}
            loadingText="Admins data Loading"
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Admins;
