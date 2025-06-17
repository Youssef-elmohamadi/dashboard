import PageMeta from "../../../components/common/PageMeta";
import AuthLayout from "../../../components/common/AuthPageLayout";
import SignInForm from "../../../components/common/SignInForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
export default function EndUserSignIn() {
  const { t } = useTranslation(["auth"]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (token) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <PageMeta
        title={t("mainTitleSignIn")}
        description={t("endUserLayoutText")}
      />
      <AuthLayout userType="end_user">
        <SignInForm userType="end_user" />
      </AuthLayout>
    </>
  );
}
