import PageMeta from "../../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import AdminSignInForm from "../../../components/admin/auth/AdminSignInForm";
import SuperAdminSignInForm from "../../../components/SuperAdmin/Auth/SuperAdminSignInForm";

export default function SuperAdminSignIn() {
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
