import PageMeta from "../../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../../components/admin/auth/SignUpForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function AdminSignUp() {
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
        title="Tashtiba | Register Admin"
        description="Register as a New Admin Manege your Store"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
