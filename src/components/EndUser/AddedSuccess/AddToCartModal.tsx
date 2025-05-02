import React from "react";
import { useModal } from "../../../pages/UserPages/Context/ModalContext";
import { BsFillCartCheckFill } from "react-icons/bs";
import { Link } from "react-router-dom";

interface AddToCartModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalProps: { name: string; images: { image: string }[]; price: string };
}

const AddToCartModal: React.FC = () => {
  const { modalType, modalProps, closeModal }: any = useModal();
  if (modalType !== "addtocart") return null;

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl space-y-6"
      >
        <button
          className="absolute top-3 right-3 bg-gray-500 w-8 h-8 flex items-center justify-center rounded-full text-white text-lg hover:bg-gray-600"
          onClick={closeModal}
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center space-y-3">
          <BsFillCartCheckFill className="text-green-600 text-5xl" />
          <h2 className="text-xl font-semibold text-green-600">
            The product has been added to your cart!
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <img
            src={modalProps?.images?.[0]?.image || ""}
            alt={modalProps.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1">
            <p className="text-base text-gray-800 font-medium line-clamp-2">
              {modalProps.name}
            </p>
            <p className="text-purple-700 font-semibold mt-1">
              {modalProps.price * (modalProps.quantity || 1)} EGP
            </p>
            <p className="text-xs text-gray-500 mt-1">Thank you!</p>
          </div>
        </div>

        <div className="flex justify-between gap-3 text-sm font-medium">
          <Link
            to="/cart"
            onClick={closeModal}
            className="flex-1 py-2 bg-purple-700 text-center text-white rounded-md hover:bg-purple-800 transition"
          >
            Continue to Checkout
          </Link>
          <button
            onClick={closeModal}
            className="flex-1 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
          >
            Back to Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
