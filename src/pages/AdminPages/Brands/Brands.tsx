import React from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import BrandsTable from "../../../components/admin/brandsTable/BrandsTable";
const Brands = () => {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Brands" />
      <div className="space-y-6">
        <ComponentCard
          title="All Brands"
          headerAction="Add New Brand"
          href="create"
        >
          <BrandsTable />
        </ComponentCard>
      </div>
    </>
  );
};

export default Brands;
