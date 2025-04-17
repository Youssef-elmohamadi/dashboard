import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import UserTable from "../../../components/admin/usersTable/UserTable";
const Admins = () => {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Admins" />
      <div className="space-y-6">
        <ComponentCard
          title="All Admins"
          headerAction="Add New Admin"
          href="/admin/admins/create"
        >
          <UserTable />
        </ComponentCard>
      </div>
    </>
  );
};

export default Admins;
