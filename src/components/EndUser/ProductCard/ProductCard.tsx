import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { MdOutlineStarBorder } from "react-icons/md";
import { TbStarHalfFilled } from "react-icons/tb";
import { BsFillStarFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { useModal } from "../../../pages/UserPages/Context/ModalContext";
const LazyImage = ({ src, alt, className }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      ref={ref}
      className={`w-full h-full ${
        isLoading ? "bg-gray-100 animate-pulse" : ""
      }`}
    >
      {inView && (
        <img
          src={src}
          alt={alt}
          className={className}
          onLoad={handleImageLoad}
        />
      )}
    </div>
  );
};
const ProductCard = ({ product }) => {
  const { openModal } = useModal();

  const handleAddToWishlist = () => {
    console.log(`Add to Wishlist: ${product.title}`);
  };

  return (
    <div className="w-full border rounded p-3 relative">
      {/* أيقونة الـ Wishlist */}
      <button
        onClick={handleAddToWishlist}
        className="absolute top-2 left-2 bg-transparent text-gray-300 p-2 rounded-full z-10  hover:text-red-500 transition"
      >
        <FaHeart className="text-xl" />
      </button>

      <div className="w-full h-[300px]">
        <LazyImage
          src={product?.images[0]?.image}
          alt={product?.name}
          className="w-full h-full object-cover rounded"
        />
      </div>

      <Link
        to={`/product/${product.id}`}
        className="text-base  my-2 px-1 block font-medium line-clamp-2"
      >
        {product.name}
      </Link>
      <div className="flex justify-between items-center gap-2 border-t py-3">
        <span className="text-primary font-semibold text-sm sm:text-base">
          ${product.price}
        </span>

        <div className="flex items-center gap-1">
          <StarRatings
            rating={product.rating || 0}
            starDimension="17px"
            starSpacing="1px"
            starRatedColor="#fbbf24"
            numberOfStars={5}
            name="rating"
            starEmptyIcon={<MdOutlineStarBorder />}
            starHalfIcon={<TbStarHalfFilled />}
            starFullIcon={<BsFillStarFill />}
          />
        </div>
      </div>

      {/* زر Add to Cart */}
      <button
        onClick={() => openModal("product", product)}
        className="w-full bg-primary text-white rounded px-3 py-2 text-sm sm:text-base hover:bg-primary/90 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
