import React from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import RolesTable from "../../../components/admin/RolesTable/RolesTable";
const Roles = () => {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Roles" />
      <div className="space-y-6">
        <ComponentCard
          title="All Roles"
          headerAction="Add New Role"
          href="create"
        >
          <RolesTable />
        </ComponentCard>
      </div>
    </>
  );
};

export default Roles;
