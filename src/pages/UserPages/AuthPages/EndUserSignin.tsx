import PageMeta from "../../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import EndUserSignInForm from "../../../components/EndUser/Auth/EndUserSignInForm";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function EndUserSignIn() {
    const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("uToken");
    if (token) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <EndUserSignInForm />
      </AuthLayout>
    </>
  );
}
