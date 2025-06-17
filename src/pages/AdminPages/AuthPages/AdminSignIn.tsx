import PageMeta from "../../../components/common/PageMeta";
import AuthLayout from "../../../components/common/AuthPageLayout";
import SignInForm from "../../../components/common/SignInForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminSignIn() {
  const navigate = useNavigate();
  const { t } = useTranslation(["auth"]);
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      navigate("/admin");
    }
  }, []);
  return (
    <>
      <PageMeta
        title={t("mainTitleSignIn")}
        description="Login and Manege your Store"
      />
      <AuthLayout userType="admin">
        <SignInForm userType="admin" />
      </AuthLayout>
    </>
  );
}
