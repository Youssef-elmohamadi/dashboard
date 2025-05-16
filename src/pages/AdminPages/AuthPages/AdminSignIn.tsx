import PageMeta from "../../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import AdminSignInForm from "../../../components/admin/auth/AdminSignInForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSignIn() {
    const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("aToken");
    if (token) {
      navigate("/admin");
    }
  }, []);
  return (
    <>
      <PageMeta
        title="Tashtiba | Login Admin"
        description="Login and Manege your Store"
      />
      <AuthLayout>
        <AdminSignInForm />
      </AuthLayout>
    </>
  );
}
