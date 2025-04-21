import PageMeta from "../../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../../components/admin/auth/SignUpForm";
import EndUserSignUpForm from "../../../components/EndUser/Auth/EndUserSignUpForm";

export default function EndUserSignUp() {
  return (
    <>
      <PageMeta
        title="React.js SignUp Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignUp Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <EndUserSignUpForm />
      </AuthLayout>
    </>
  );
}
