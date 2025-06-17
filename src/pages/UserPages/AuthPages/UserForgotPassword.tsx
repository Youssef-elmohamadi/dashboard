import { useEffect } from "react";
import AuthLayout from "../../../components/common/AuthPageLayout";
import ResetPassword from "../../../components/common/ResetPassword";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../../components/common/PageMeta";
import { useTranslation } from "react-i18next";
const UserForgotPassword = () => {
  const { t } = useTranslation(["auth"]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (token) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <PageMeta
        title={t("mainTitleForgotPassword")}
        description={t("endUserLayoutText")}
      />
      <AuthLayout userType="end_user">
        <ResetPassword type="user" />
      </AuthLayout>
    </div>
  );
};

export default UserForgotPassword;
