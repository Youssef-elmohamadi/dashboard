import { useState, useEffect } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/src/styles.css";
import { useModal } from "../../../pages/UserPages/Context/ModalContext";
import { useDispatch } from "react-redux";
import { addItem } from "../Redux/cartSlice/CartSlice";
import { useQuery } from "@tanstack/react-query";
import StarRatings from "react-star-ratings";
import { getAllCategories } from "../../../api/EndUserApi/endUserCategories/_requests";
import { useTranslation } from "react-i18next";

const ProductModal = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const { modalType, openModal, modalProps, closeModal }: any = useModal();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation(["EndUserProductModal"]);
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getAllCategories();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleAddToCart = (item: any) => {
    dispatch(addItem({ item, quantity }));
    openModal("addtocart", { ...item, quantity });
  };

  useEffect(() => {
    if (modalProps?.images) {
      setSelectedImage(modalProps.images[0]?.image || null);
    }
  }, [modalProps]);

  if (modalType !== "product") return null;

  const images = modalProps.images?.map((image) => image.image);
  const categoryName =
    categories?.find((cat) => cat.id === modalProps?.category_id)?.name ||
    t("unknownCategory");
  const discounted = modalProps.discount_price;
  const finalPrice = discounted || modalProps.price;

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
          className="absolute z-50 top-3 right-3 bg-gray-500 w-8 h-8 rounded-full text-white text-lg"
          onClick={closeModal}
        >
          ✕
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          <div>
            <InnerImageZoom
              src={selectedImage}
              zoomSrc={selectedImage}
              zoomType="hover"
              zoomPreload={false}
              className="rounded w-full max-h-[400px] object-contain"
            />
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-14 object-cover border-2 cursor-pointer rounded ${
                    selectedImage === img
                      ? "border-purple-500"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{modalProps?.name}</h2>
            <p className="text-sm text-gray-700">{modalProps?.description}</p>

            <div className="text-sm text-gray-500">
              {t("category")}:{" "}
              <span className="font-semibold">{categoryName}</span>
            </div>

            <div className="flex gap-3 items-center">
              <span className="text-lg font-bold text-purple-700">
                {discounted && (
                  <span className="line-through text-sm text-gray-500 mr-2">
                    {modalProps.price} {t("egp")}
                  </span>
                )}
                {finalPrice} {t("egp")}
              </span>
              {discounted && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {t("discountApplied")}
                </span>
              )}
            </div>

            <StarRatings
              rating={modalProps.rate || 0}
              starRatedColor="#facc15"
              numberOfStars={5}
              starDimension="20px"
              starSpacing="2px"
              name="rating"
            />

            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-600">{t("quantity")}:</span>
              <button
                className="bg-gray-400 text-white px-2 py-1 rounded"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) setQuantity(val);
                }}
                className="w-12 text-center border border-gray-200 rounded"
              />
              <button
                className="bg-gray-400 text-white px-2 py-1 rounded"
                onClick={() => setQuantity((prev) => Math.min(prev + 1, 99))}
              >
                +
              </button>
            </div>

            <button
              onClick={() => handleAddToCart(modalProps)}
              className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
            >
              {t("addToCart")}
            </button>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">{t("reviews")}:</h4>
              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                {modalProps.review?.length > 0 ? (
                  modalProps.review.map((rev, idx) => (
                    <div key={idx} className="border border-gray-200 p-2 rounded-md">
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
