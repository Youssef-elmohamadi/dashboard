import PageMeta from "../../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import AdminSignInForm from "../../../components/admin/auth/AdminSignInForm";
import SuperAdminSignInForm from "../../../components/SuperAdmin/Auth/SuperAdminSignInForm";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function SuperAdminSignIn() {
    const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("sToken");
    if (token) {
      navigate("/super_admin");
    }
  }, []);
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SuperAdminSignInForm />
      </AuthLayout>
    </>
  );
}
