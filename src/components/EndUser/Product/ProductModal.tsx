import { useState, useEffect, use } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/src/styles.css";
import { useModal } from "../context/ModalContext";
import { useDispatch } from "react-redux";
import { addItem } from "../Redux/cartSlice/CartSlice";
import StarRatings from "react-star-ratings";
import { useTranslation } from "react-i18next";
import { Product } from "../../../types/Product";
import { ImageObject, Review } from "../../../types/Common";
import { CloseIcon } from "../../../icons";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { toast } from "react-toastify";
const ProductModal = () => {
  const { modalType, openModal, modalProps, closeModal }: any = useModal();
  const [selectedImage, setSelectedImage] = useState("");
  const dispatch = useDispatch();
  const { t } = useTranslation(["EndUserProductModal"]);
  const { lang } = useDirectionAndLanguage();
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const displayStock =
    selectedVariant && selectedVariant.stock_quantity
      ? selectedVariant.stock_quantity
      : modalProps.stock_quantity;
  const stockQuantity = Number(displayStock) || 0;
  const isAvailable = stockQuantity > 0;
  const [quantity, setQuantity] = useState(isAvailable ? 1 : 0);
  useEffect(() => {
    if (modalProps?.images && modalProps.images.length > 0) {
      setSelectedImage(modalProps.images[0]?.image);
    }
    setQuantity(1);
    if (modalProps?.variant_id) {
      setSelectedVariant(
        modalProps.variants.find((v: any) => v.id === modalProps.variant_id) ||
          null
      );
    } else {
      setSelectedVariant(null);
    }
  }, [modalProps]);
  useEffect(() => {
    if (modalType === "product" && modalProps) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalProps, modalType]);

  if (modalType !== "product" || !modalProps) {
    return null;
  }

  const handleAddToCart = (item: Product) => {
    if (!isAvailable) {
      toast.error(t("outOfStockMessage"));
      return;
    }
    const itemWithVariant = {
      ...item,
      variant_id: selectedVariant?.id,
      price: selectedVariant ? selectedVariant.price : item.price,
      discount_price: selectedVariant
        ? selectedVariant.discount_price
        : item.discount_price,
    };

    dispatch(addItem({ item: itemWithVariant, quantity }));
    openModal("addtocart", { ...itemWithVariant, quantity });
  };

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
  };

  const images = modalProps.images?.map(
    (imageObj: ImageObject) => imageObj.image
  );

  const priceToDisplay = selectedVariant || modalProps;
  const hasDiscount = priceToDisplay.discount_price;

  const currentPrice = hasDiscount
    ? Number(priceToDisplay.discount_price).toFixed(2)
    : Number(priceToDisplay.price).toFixed(2);

  const originalPrice = hasDiscount
    ? Number(priceToDisplay.price).toFixed(2)
    : null;

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-xl shadow-lg md:w-4/5 lg:w-2/3 w-[calc(100%-30px)] relative max-h-[90vh] overflow-y-auto"
      >
        <button
          className="absolute z-50 top-3 right-3 bg-gray-500 w-8 h-8 rounded-full text-white text-lg flex items-center justify-center"
          onClick={closeModal}
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          {/* Image Gallery Section */}
          <div>
            <InnerImageZoom
              src={selectedImage}
              zoomSrc={
                selectedImage || "/images/product/placeholder-image.webp"
              }
              zoomType="hover"
              zoomPreload={false}
              className="rounded w-full max-h-[600px] object-contain"
            />
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {images?.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-14 object-cover border-2 cursor-pointer rounded ${
                    selectedImage === img
                      ? "border-[#d62828]"
                      : "border-gray-300"
                  }`}
                  alt={`${modalProps?.name} - ${t("image")} ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              {modalProps?.[`name_${lang}`]}
            </h2>
            <p className="text-sm text-gray-700">
              {modalProps?.[`description_${lang}`]}
            </p>

            <div className="text-sm text-gray-500">
              {t("category")}:{" "}
              <span className="font-semibold">
                {modalProps?.category?.[`name_${lang}`] || t("unknownCategory")}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <StarRatings
                rating={modalProps.rating || 0}
                starRatedColor="#facc15"
                numberOfStars={5}
                starDimension="20px"
                starSpacing="2px"
                name="rating"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <img
                    src={modalProps.brand?.image}
                    className="w-6 h-6 rounded-full object-cover"
                    alt={modalProps.brand?.[`name_${lang}`]}
                  />
                  <span>{modalProps.brand?.[`name_${lang}`]}</span>
                </div>
                <div>
                  {isAvailable ? (
                    <>
                      <strong>{t("available")}:</strong> {displayStock}
                      {"    "}
                      {modalProps[`unit_${lang}`]} {"    "}
                      <strong>{t("inStock")}</strong>
                    </>
                  ) : (
                    <strong>{t("outOfStock")}</strong>
                  )}
                </div>
              </div>
              {Array.isArray(modalProps.attributes) &&
                modalProps.attributes.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      {t("specifications")}:
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {modalProps.attributes.map((attr: any, i: number) => (
                        <li key={i}>
                          <strong>{attr[`attribute_name_${lang}`]}:</strong>{" "}
                          {attr[`attribute_value_${lang}`]}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {Array.isArray(modalProps.tags) && modalProps.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap pt-2">
                  {modalProps.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-red-300 text-black px-3 py-1 text-xs rounded-full"
                    >
                      #{tag[`name_${lang}`]}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold end-user-text-base">
                  {currentPrice} {t("egp")}
                </span>
                {hasDiscount && (
                  <span className="line-through text-sm text-gray-500">
                    {originalPrice} {t("egp")}
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {t("discountApplied")}{" "}
                    {Math.round(
                      ((Number(originalPrice) - Number(currentPrice)) /
                        Number(originalPrice)) *
                        100
                    )}
                    % {t("sale")}
                  </span>
                )}
              </div>
            </div>

            {Array.isArray(modalProps.variants) &&
              modalProps.variants.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="font-semibold text-gray-700">
                    {lang === "ar"
                      ? "الاختيارات المتاحة"
                      : "Available Variants"}
                    :
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {modalProps.variants.map((variant, i) => (
                      <button
                        key={i}
                        onClick={() => handleVariantSelect(variant)}
                        className={`
            px-4 py-2 rounded-lg border transition-colors duration-200
            ${
              selectedVariant?.id === variant.id
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
            }
          `}
                      >
                        <span>{variant[`variant_name_${lang}`]}: </span>
                        {variant[`variant_value_${lang}`]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-600">{t("quantity")}:</span>
              <button
                className="bg-gray-400 text-white px-2 py-1 rounded disabled:opacity-50"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                disabled={quantity === 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) {
                    setQuantity(Math.min(val, displayStock));
                  }
                }}
                className="w-12 text-center border border-gray-200 rounded"
              />
              <button
                className="bg-gray-400 text-white px-2 py-1 rounded disabled:opacity-50"
                onClick={() =>
                  setQuantity((prev) => Math.min(prev + 1, displayStock))
                }
                disabled={quantity >= displayStock}
              >
                +
              </button>
            </div>
            {/* <div className="flex items-center gap-3">
              <span className="text-lg font-bold end-user-text-base">
                {totalPriceOfItem} {t("egp")}
              </span>
              {hasDiscount && (
                <span className="line-through text-sm text-gray-500">
                  {totalOutOfDiscount} {t("egp")}
                </span>
              )}
            </div> */}

            <button
              onClick={() => handleAddToCart(modalProps)}
              className="end-user-bg-base text-white px-4 py-2 rounded hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isAvailable}
            >
              {t("addToCart")}
            </button>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">{t("reviews")}:</h4>
              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                {modalProps.review?.length > 0 ? (
                  modalProps.review.map((rev: Review, idx: number) => (
                    <div
                      key={idx}
                      className="border border-gray-200 p-2 rounded-md"
                    >
                      <StarRatings
                        rating={rev.rating}
                        starRatedColor="#facc15"
                        numberOfStars={5}
                        starDimension="15px"
                        starSpacing="1px"
                        name="review-rating"
                      />
                      <p className="text-sm mt-1">{rev.review}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">{t("noReviews")}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
