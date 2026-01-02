import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import { alertDelete } from "../../../components/admin/Tables/Alert";
import { buildColumns } from "../../../components/admin/Tables/_Colmuns";
import BasicTable from "../../../components/admin/Tables/BasicTableTS";
import Alert from "../../../components/ui/alert/Alert";
import SearchTable from "../../../components/admin/Tables/SearchTable";
import { useTranslation } from "react-i18next";

import { AxiosError } from "axios";
import { SearchValues } from "../../../types/Roles";
import { ID, TableAlert } from "../../../types/Common";
import SEO from "../../../components/common/SEO/seo";
import {
  useAllProductQuestions,
  useDeleteProductQuestion,
} from "../../../hooks/Api/Admin/useProductQuestions/useAdminProductQuestions";

const Questions = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [unauthorized, setUnauthorized] = useState(false);
  const [globalError, setGlobalError] = useState(false);
  const [searchValues, setSearchValues] = useState<SearchValues>({
    name: "",
  });
  const location = useLocation();
  const { t } = useTranslation("QuestionsTable");
  const { data, isLoading, isError, error, refetch } = useAllProductQuestions(
    pageIndex,
    searchValues
  );

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error?.response?.status;
      if (status === 403 || status === 401) {
        setUnauthorized(true);
      } else if (status === 500) {
        setGlobalError(true);
      } else {
        setGlobalError(true);
      }
    }
  }, [isError, error]);
  const pageSize = data?.per_page ?? 15;
  const questionsData = data?.data ?? [];
  const totalQuestions = data?.total ?? 0;
  const [alertData, setAlertData] = useState<TableAlert | null>(null);

  useEffect(() => {
    if (location.state?.successCreate) {
      setAlertData({
        variant: "success",
        title: t("QuestionsTable:questionsPage.createdSuccessTitle"),
        message: t("QuestionsTable:questionsPage.createdSuccessMessage", {
          message: location.state.successCreate,
        }),
      });
      window.history.replaceState({}, document.title);
    } else if (location.state?.successUpdate) {
      setAlertData({
        variant: "success",
        title: t("QuestionsTable:questionsPage.updatedSuccessTitle"),
        message: t("QuestionsTable:questionsPage.updatedSuccessMessage", {
          message: location.state.successUpdate,
        }),
      });
      window.history.replaceState({}, document.title);
    }
    const timer = setTimeout(() => {
      setAlertData(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.state, t]);

  const handleSearch = (key: string, value: string) => {
    setSearchValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPageIndex(0);
  };

  const { mutateAsync: deleteRoleMutate } = useDeleteProductQuestion();
  const handleDelete = async (id: ID) => {
    await alertDelete(id, deleteRoleMutate, refetch, {
      confirmTitle: t("QuestionsTable:questionsPage.delete.confirmTitle"),
      confirmText: t("QuestionsTable:questionsPage.delete.confirmText"),
      confirmButtonText: t(
        "QuestionsTable:questionsPage.delete.confirmButtonText"
      ),
      cancelButtonText: t(
        "QuestionsTable:questionsPage.delete.cancelButtonText"
      ),
      successTitle: t("QuestionsTable:questionsPage.delete.successTitle"),
      successText: t("QuestionsTable:questionsPage.delete.successText"),
      errorTitle: t("QuestionsTable:questionsPage.delete.errorTitle"),
      errorText: t("QuestionsTable:questionsPage.delete.errorText"),
      lastButton: t("QuestionsTable:questionsPage.delete.lastButton"),
    });
  };
  const columns = buildColumns({
    includeTitle: true,
    includeQuestion: true,
    includeQuestionType: true,
    includeStatus: true,
    includeActions: true,
  });
  return (
    <>
      {alertData && (
        <Alert
          variant={alertData.variant}
          title={alertData.title}
          message={alertData.message}
        />
      )}
      <SEO
        title={{
          ar: "إدارة الاسئلة",
          en: "Questions Management",
        }}
        description={{
          ar: "إدارة صلاحيات الأسئلة في نظام تشطيبة. عرض، إضافة، تعديل، وحذف الأسئلة وصلاحيات الوصول الخاصة بها.",
          en: "Manage user questions in Tashtiba system. View, add, edit, and delete questions and their access rights.",
        }}
        keywords={{
          ar: ["أسئلةالمنتجات", "إدارة الأسئلة", "تشطيبة", "تحكم", "أذونات"],
          en: [
            "questions",
            "user permissions",
            "question management",
            "Tashtiba",
            "access control",
            "privileges",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <PageBreadcrumb
        pageTitle={t("QuestionsTable:questionsPage.title")}
        userType="admin"
      />{" "}
      {/* Added namespace */}
      <div>
        <SearchTable
          fields={[{ key: "name", label: t("QuestionsTable:questionsPage.search.nameLabel"), type: "input" }]}
          setSearchParam={handleSearch}
          searchValues={searchValues}
        />
      </div>
      <div className="space-y-6">
        <ComponentCard
          title={t("QuestionsTable:questionsPage.all")} // Added namespace
          headerAction={t("QuestionsTable:questionsPage.addNew")} // Added namespace
          href="/admin/product_questions/create"
        >
          <BasicTable
            columns={columns}
            data={questionsData}
            totalItems={totalQuestions}
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={() => {}}
            isShowMore={true}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPageChange={setPageIndex}
            unauthorized={unauthorized}
            globalError={globalError}
            loadingText={t("QuestionsTable:questionsPage.table.loadingText")}
          />
        </ComponentCard>
      </div>
    </>
  );
};

export default Questions;
