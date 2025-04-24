import { useState, useEffect } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/src/styles.css";
import { useModal } from "../../../pages/UserPages/Context/ModalContext";
import { useDispatch } from "react-redux";
import { addItem } from "../Redux/cartSlice/CartSlice";
const ProductModal = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const { modalType, openModal, modalProps, closeModal }: any = useModal();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
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

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-xl shadow-lg md:w-1/2 w-[calc(100%-30px)]  relative max-h-[80vh] overflow-y-auto"
      >
        <button
          className="absolute top-3 right-3 bg-gray-500 w-8 h-8 rounded-full text-white text-lg"
          onClick={closeModal}
        >
          ✕
        </button>

        <div className="grid grid-cols-6 gap-4">
          <div className="lg:col-span-1 col-span-2 flex flex-col gap-2 overflow-y-auto max-h-[400px]">
            {images?.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setSelectedImage(img)}
                className={`w-full h-20 object-cover border-2 cursor-pointer rounded ${
                  selectedImage === img ? "border-blue-500" : "border-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="lg:col-span-2 col-span-4 flex justify-center items-center">
            <div className="max-h-[500px] w-full flex justify-center">
              <InnerImageZoom
                src={selectedImage}
                zoomSrc={selectedImage}
                zoomType="hover"
                zoomPreload={false}
                className="object-contain h-full rounded"
              />
            </div>
          </div>
          <div className="mt-6 lg:col-span-3 col-span-6 px-2">
            <h2 className="text-2xl font-bold mb-2">
              {modalProps?.name || "Product Name"}
            </h2>
            <p className="text-sm text-black mb-2">
              {modalProps?.description || "Product Description"}
            </p>
            <div className="flex gap-10 mb-2">
              <span className="font-medium text-gray-600">Price </span>
              <span className="font-bold">
                {modalProps?.price || "price"} EGP
              </span>
            </div>

            <div className="flex gap-5 items-center mb-2">
              <span className="font-medium text-gray-600">Quantity </span>
              <button
                className="bg-gray-400 text-white text-base p-2"
                onClick={() => setQuantity((prev) => Math.min(prev + 1, 99))} // تحديد أعلى قيمة لو حبيت
              >
                +
              </button>
              <input
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0) {
                    setQuantity(value);
                  }
                }}
                className="w-10 text-center border rounded"
                type="text"
                min={1}
              />
              <button
                className="bg-gray-400 text-white text-base p-2"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              >
                -
              </button>
            </div>

            <div className="flex gap-5 items-center mb-2">
              <span className="font-medium text-gray-600">Total Price</span>
              <span className="font-bold">
                {(modalProps?.price * quantity || 0).toFixed(2)} EGP
              </span>
            </div>
            <button
              onClick={() => {
                handleAddToCart(modalProps);
              }}
              className="w-1/2 bg-primary text-white rounded px-3 py-2 text-sm sm:text-base hover:bg-primary/90 transition mb-2"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
