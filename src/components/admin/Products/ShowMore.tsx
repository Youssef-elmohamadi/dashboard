import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetProductById } from "../../../hooks/Api/Admin/useProducts/useAdminProducts";
import SEO from "../../common/SEO/seo";
import { AxiosError } from "axios";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import LazyImage from "../../common/LazyImage";
import {
  useAssignQuestionsToProduct,
  useGetAllQuestions,
  useUnassignQuestionsFromProduct,
} from "../../../hooks/Api/Admin/useProductQuestions/useAdminProductQuestions";
import Select from "../../common/form/Select";
import Alert from "../../ui/alert/Alert";

const ProductDetails: React.FC = () => {
  const { t } = useTranslation(["ProductDetails", "Meta"]);
  const { id }: any = useParams();
  const { lang } = useDirectionAndLanguage();
  const {
    data: product,
    isError,
    error,
    isLoading,
    refetch,
  } = useGetProductById(id);

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  let pageStatus = PageStatus.SUCCESS;
  let errorMessage = "";

  if (!id) {
    pageStatus = PageStatus.NOT_FOUND;
    errorMessage = t("ProductDetails:no_data");
  } else if (isLoading) {
    pageStatus = PageStatus.LOADING;
  } else if (isError) {
    const axiosError = error as AxiosError;
    pageStatus = PageStatus.ERROR;
    if ([401, 403].includes(axiosError?.response?.status || 0)) {
      errorMessage = t("ProductDetails:global_error");
    } else {
      errorMessage = t("ProductDetails:global_error");
    }
  } else if (!product) {
    pageStatus = PageStatus.NOT_FOUND;
    errorMessage = t("ProductDetails:not_found");
  }

  const handleRetry = () => {
    refetch();
  };

  const { data } = useGetAllQuestions();
  const allQuestions = data?.data?.data;

  const [selectedQuestionId, setSelectedQuestionId] = React.useState("");
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);
  const { mutate: assignQuestion, isLoading: isAssigning } =
    useAssignQuestionsToProduct(
      selectedQuestionId ? Number(selectedQuestionId) : 0,
      id ? Number(id) : 0
    );

  const handleAssignQuestion = () => {
    if (!selectedQuestionId || !id) return;

    assignQuestion(
      { product_id: id },
      {
        onSuccess: () => {
          setAlertData({
            variant: "success",
            title: "تم الربط بنجاح",
            message: "تم ربط السؤال بالمنتج بنجاح",
          });
          setSelectedQuestionId("");
        },
        onError: (error: any) => {
          setAlertData({
            variant: "error",
            title: "حدث خطأ",
            message:
              error?.response?.data?.message || "حدث خطأ أثناء ربط السؤال",
          });
        },
      }
    );
  };

  const [removingId, setRemovingId] = useState<number | null>(null);

  const { mutate: removeQuestion } = useUnassignQuestionsFromProduct(
    removingId ?? 0
  );
  const handleRemoveQuestion = (productQuestionId: number) => {
    setRemovingId(productQuestionId);

    removeQuestion(
      { product_id: id },
      {
        onSuccess: () => {
          setAlertData({
            variant: "success",
            title: "تم الحذف بنجاح",
            message: "تم حذف السؤال من المنتج بنجاح",
          });
          refetch(); // إعادة تحميل المنتج
        },
        onError: (error: any) => {
          setAlertData({
            variant: "error",
            title: "حدث خطأ",
            message:
              error?.response?.data?.message ||
              "حدث خطأ أثناء حذف السؤال من المنتج",
          });
        },
      }
    );
  };

  return (
    <PageStatusHandler
      status={pageStatus}
      errorMessage={errorMessage}
      loadingText={t("ProductDetails:loading")}
      notFoundText={t("ProductDetails:not_found")}
      onRetry={handleRetry}
    >
      <SEO
        title={{
          ar: ` ${product?.name_ar || "تفاصيل المنتج"}`,
          en: `${product?.name_en || "Product Details"}`,
        }}
        description={{
          ar: `استعرض تفاصيل المنتج "${
            product?.name_ar || "غير معروف"
          }" في تشطيبة، بما في ذلك السعر، الوصف، والصور.`,
          en: `View details for product "${
            product?.name_en || "Unknown"
          }" on Tashtiba, including price, description, and images.`,
        }}
        keywords={{
          ar: [
            `${product?.name_ar || "منتج"}`,
            "تفاصيل المنتج",
            "عرض منتج",
            "سعر المنتج",
            "وصف المنتج",
            "صور المنتج",
            "تشطيبة",
          ],
          en: [
            `${product?.name_en || "product"}`,
            "product details",
            "view product",
            "product price",
            "product description",
            "product images",
            "Tashtiba",
          ],
        }}
        robotsTag="noindex, nofollow"
      />

      <div className="product-details p-6 max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
          {t("ProductDetails:title")}
        </h1>

        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            {t("ProductDetails:sections.basic_info")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
            <p>
              <strong>{t("ProductDetails:fields.name")}:</strong>{" "}
              {product?.[`name_${lang}`]}{" "}
            </p>
            <p>
              <strong>{t("ProductDetails:fields.slug")}:</strong>{" "}
              {product?.slug}{" "}
            </p>
            <p>
              <strong>{t("ProductDetails:fields.description")}:</strong>{" "}
              {product?.[`description_${lang}`]}
            </p>
            <p>
              <strong>{t("ProductDetails:fields.status")}:</strong>{" "}
              {product?.status}
            </p>
            <p>
              <strong>{t("ProductDetails:fields.featured")}:</strong>{" "}
              {product?.is_featured
                ? t("ProductDetails:yes")
                : t("ProductDetails:no")}{" "}
            </p>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            {t("ProductDetails:sections.pricing_stock")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
            <p>
              <strong>{t("ProductDetails:fields.price")}:</strong>{" "}
              {product?.price} {t("ProductDetails:egp")}
            </p>
            <p>
              <strong>{t("ProductDetails:fields.discount_price")}:</strong>{" "}
              {product?.discount_price} {t("ProductDetails:egp")}{" "}
            </p>
            <p>
              <strong>{t("ProductDetails:fields.stock_quantity")}:</strong>{" "}
              {product?.stock_quantity}
            </p>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">
            {t("ProductDetails:sections.category_brand")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
            <p>
              <strong>{t("ProductDetails:fields.category")}:</strong>{" "}
              {product?.category?.[`name_${lang}`]}
            </p>
            <p>
              <strong>{t("ProductDetails:fields.brand")}:</strong>{" "}
              {product?.brand?.[`name_${lang}`]}
            </p>
          </div>
        </section>

        {/* <section className="bg-white dark:bg-gray-900 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-yellow-700">
            {t("ProductDetails:sections.vendor_info")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
            <p>
              <strong>{t("ProductDetails:fields.vendor_name")}:</strong>{" "}
              {product?.vendor?.name}
            </p>
            <p>
              <strong>{t("ProductDetails:fields.vendor_email")}:</strong>{" "}
              {product?.vendor?.email}
            </p>
            <p>
              <strong>{t("ProductDetails:fields.vendor_phone")}:</strong>{" "}
              {product?.vendor?.phone}
            </p>
          </div>
        </section> */}

        {(product?.variants?.length ?? 0) > 0 && (
          <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              {t("ProductDetails:sections.variants")}
            </h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-white">
              {product?.variants?.map((variant) => (
                <li key={variant.id}>
                  <strong>{variant[`variant_name_${lang}`]}:</strong>{" "}
                  {variant[`variant_value_${lang}`]} - {variant.price}{" "}
                  {t("ProductDetails:egp")}
                  {variant.discount_price && (
                    <>
                      {" "}
                      ({t("ProductDetails:fields.discount_price")}:{" "}
                      {variant.discount_price} {t("ProductDetails:egp")})
                    </>
                  )}
                  - {t("ProductDetails:fields.stock_quantity")}:{" "}
                  {variant.stock_quantity}
                </li>
              ))}
            </ul>
          </section>
        )}
        {(product?.attributes?.length ?? 0) > 0 && (
          <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              {t("ProductDetails:sections.attributes")}
            </h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-white">
              {product?.attributes?.map((attr) => (
                <li key={attr.id}>
                  <strong>{attr[`attribute_name_${lang}`]}:</strong>{" "}
                  {attr[`attribute_value_${lang}`]}
                </li>
              ))}
            </ul>
          </section>
        )}

        {(product?.tags?.length ?? 0) > 0 && (
          <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-4 text-pink-700">
              {t("ProductDetails:sections.tags")}
            </h2>
            <div className="flex flex-wrap gap-2 text-gray-700 dark:text-white">
              {product?.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-gray-200 text-sm px-3 py-1 rounded-full"
                >
                  {tag[`name_${lang}`]}
                </span>
              ))}
            </div>
          </section>
        )}

        {(product?.images?.length ?? 0) > 0 && (
          <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-4 text-red-700">
              {t("ProductDetails:sections.images")}
            </h2>
            <div className="flex flex-wrap gap-4 text-gray-700 dark:text-white">
              {product?.images?.map((img: any) => (
                <LazyImage
                  key={img.id}
                  src={img.image}
                  alt="Product"
                  className="w-32 h-32 object-cover rounded-md border border-gray-200"
                />
              ))}
            </div>
          </section>
        )}

        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {t("ProductDetails:sections.timestamps")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
            <p>
              <strong>{t("ProductDetails:fields.created_at")}:</strong>{" "}
              {formatDate(product?.created_at)}
            </p>
            <p>
              <strong>{t("ProductDetails:fields.updated_at")}:</strong>{" "}
              {formatDate(product?.updated_at)}
            </p>
          </div>
          {/* سكشن ربط الأسئلة بالمنتج */}
        </section>

        <section className="bg-white p-6 rounded-xl dark:bg-gray-900 border-2 border-dashed border-blue-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            {t(
              "ProductDetails:sections.assign_question",
              "ربط سؤال بهذا المنتج"
            )}
          </h2>

          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("ProductDetails:fields.select_question", "اختر السؤال")}
              </label>
              <Select
                options={allQuestions?.map((question: any) => ({
                  label: lang === "ar" ? question.title_ar : question.title_en,
                  value: question.id,
                }))}
                value={selectedQuestionId}
                onChange={(value) => setSelectedQuestionId(value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>

            <button
              onClick={handleAssignQuestion}
              disabled={!selectedQuestionId || isAssigning}
              className={`${
                isAssigning ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center min-w-[120px]`}
            >
              {isAssigning ? (
                <span className="animate-spin mr-2">...</span>
              ) : (
                t("ProductDetails:buttons.assign", "ربط السؤال")
              )}
            </button>
          </div>
        </section>
        {alertData && (
          <div className="mb-4">
            <Alert
              variant={alertData.variant}
              title={alertData.title}
              message={alertData.message}
            />
          </div>
        )}
        {(product?.questions?.length ?? 0) > 0 && (
          <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-6 text-blue-700">
              {t(
                "ProductDetails:sections.questions",
                "الأسئلة المرتبطة بالمنتج"
              )}
            </h2>

            <div className="space-y-6">
              {product.questions.map((item: any) => {
                const q = item.question;

                return (
                  <div
                    key={item.question_id}
                    className="border rounded-xl p-5 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  >
                    {/* Question Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {q[`title_${lang}`]}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {q[`description_${lang}`]}
                        </p>

                        <div className="flex gap-3 mt-2 text-xs text-gray-500">
                          <span>
                            {q.type === "single_choice"
                              ? "اختيار واحد"
                              : "اختيارات متعددة"}
                          </span>
                          {q.is_required ? (
                            <span className="text-red-500">مطلوب</span>
                          ) : (
                            <span>اختياري</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveQuestion(item.question_id)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        إزالة
                      </button>
                    </div>

                    {/* Answers */}
                    {(q.answers?.length ?? 0) > 0 ? (
                      <ul className="mt-4 space-y-2">
                        {q.answers.map((answer: any) => (
                          <li
                            key={answer.id}
                            className="flex justify-between items-center bg-white dark:bg-gray-900 border rounded-lg px-4 py-2 text-sm"
                          >
                            <span>{answer[`answer_${lang}`]}</span>

                            {answer.price_effect && (
                              <span className="text-xs text-green-600">
                                {answer.price_effect_type === "fixed"
                                  ? `+${answer.price_effect} جنيه`
                                  : `+${answer.price_effect}%`}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-4 text-sm text-gray-400">
                        لا توجد إجابات لهذا السؤال
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </PageStatusHandler>
  );
};

export default ProductDetails;
