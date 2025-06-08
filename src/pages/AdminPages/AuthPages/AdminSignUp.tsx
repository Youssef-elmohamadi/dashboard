import PageMeta from "../../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../../components/admin/auth/SignUpForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function AdminSignUp() {
  const { t } = useTranslation(["auth"]);
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
        title={t("mainTitleSignUp")}
        description="Register as a New Admin Manege your Store"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
