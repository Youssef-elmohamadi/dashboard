import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import {
  deleteRole,
  getAllRolesPaginate,
} from "../../../api/AdminApi/rolesApi/_requests";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import BasicTable from "../../../components/admin/Tables/BasicTable";
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { useTranslation } from "react-i18next";
type Role = {};

const Roles = () => {
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [searchValues, setSearchValues] = useState<{
    name: string;
  }>({
    name: "",
  });
  const { t } = useTranslation(["RolesTable"]);
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);
  const [reload, setReload] = useState(0);
  const handleSearch = (key: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("rolesPage.createdSuccess"),
        message: location.state.successCreate,
      });
    } else if (location.state?.successUpdate) {
      setAlertData({
        variant: "success",
        title: t("rolesPage.updatedSuccess"),
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
      const response = await getAllRolesPaginate(params);
      const responseData = response.data.data;
      const fetchedData = Array.isArray(responseData.data)
        ? responseData.data
        : [];
      setData(fetchedData);
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
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        setUnauthorized(true);
        setData([]);
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
      deleteRole,
      () => fetchData(pageIndex),
      {
        confirmTitle: t("rolesPage.delete.confirmTitle"),
        confirmText: t("rolesPage.delete.confirmText"),
        confirmButtonText: t("rolesPage.delete.confirmButtonText"),
        cancelButtonText: t("rolesPage.delete.cancelButtonText"),
        successTitle: t("rolesPage.delete.successTitle"),
        successText: t("rolesPage.delete.successText"),
        errorTitle: t("rolesPage.delete.errorTitle"),
        errorText: t("rolesPage.delete.errorText"),
      }
    );
    setReload((prev) => prev + 1);
  };
  console.log(reload);

  const columns = buildColumns<Role>({
    includeRoleName: true,
    includeEmail: false,
    includeRoles: false,
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
      <PageMeta
        title="Roles Dashboard"
        description="This is the roles listing page."
      />
      <PageBreadcrumb pageTitle={t("rolesPage.title")} userType="admin" />
      <div>
        <SearchTable
          fields={[{ key: "name", label: "Name", type: "input" }]}
          setSearchParam={handleSearch}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title={t("rolesPage.all")}
          headerAction={t("rolesPage.addNew")}
          href="/admin/roles/create"
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
            onPaginationChange={({ pageIndex }) => setPageIndex(pageIndex)}
            trigger={reload}
            onDataUpdate={(newData) => setData(newData)}
            searchValueName={searchValues.name}
            loadingText={t("rolesPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Roles;
