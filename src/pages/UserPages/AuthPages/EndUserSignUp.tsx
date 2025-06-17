import PageMeta from "../../../components/common/PageMeta";
import AuthLayout from "../../../components/common/AuthPageLayout";
import EndUserSignUpForm from "../../../components/EndUser/Auth/EndUserSignUpForm";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
export default function EndUserSignUp() {
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
        title={t("mainTitleSignUp")}
        description={t("endUserLayoutText")}
      />
      <AuthLayout>
        <EndUserSignUpForm />
      </AuthLayout>
    </>
  );
}
