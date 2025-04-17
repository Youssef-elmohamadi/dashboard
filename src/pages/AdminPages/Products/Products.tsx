import React from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import ProductsTable from "../../../components/admin/Products/ProductsTable";
const Products = () => {
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
          href="/products/create"
        >
          <ProductsTable />
        </ComponentCard>
      </div>
    </>
  );
};

export default Products;
