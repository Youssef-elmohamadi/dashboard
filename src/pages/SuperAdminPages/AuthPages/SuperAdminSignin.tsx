import PageMeta from "../../../components/common/SEO/PageMeta";
import AuthLayout from "../../../components/common/Auth/AuthPageLayout";
import SignInForm from "../../../components/common/Auth/SignInForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function SuperAdminSignIn() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("super_admin_token");
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
      <AuthLayout userType="super_admin">
        <SignInForm userType="super_admin" />
      </AuthLayout>
    </>
  );
}
