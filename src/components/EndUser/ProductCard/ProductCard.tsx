import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { MdOutlineStarBorder } from "react-icons/md";
import { TbStarHalfFilled } from "react-icons/tb";
import { BsFillStarFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItem } from "../Redux/cartSlice/CartSlice";
// LazyImage داخل نفس الكارد
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

const ProductCard = ({ id, image, title, price, rating }) => {
  const dispatch = useDispatch();
  const handleAddToCart = (item) => {
    dispatch(addItem({ item, quantity: 1 }));
  };

  const handleAddToWishlist = () => {
    console.log(`Add to Wishlist: ${title}`);
  };

  return (
    <div className="w-full border rounded p-3 relative">
      {/* أيقونة الـ Wishlist */}
      <button
        onClick={handleAddToWishlist}
        className="absolute top-2 left-2 bg-transparent text-gray-300 p-2 rounded-full z-50  hover:text-red-500 transition"
      >
        <FaHeart className="text-xl" />
      </button>

      {/* صورة المنتج */}
      <div className="w-full h-[300px]">
        <LazyImage
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded"
        />
      </div>

      {/* عنوان المنتج */}
      <Link
        to={`/product/${id}`}
        className="text-base  my-2 px-1 block font-medium line-clamp-2"
      >
        {title}
      </Link>

      {/* السعر والتقييم */}
      <div className="flex justify-between items-center gap-2 border-t py-3">
        <span className="text-primary font-semibold text-sm sm:text-base">
          ${price}
        </span>

        <div className="flex items-center gap-1">
          <StarRatings
            rating={rating}
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
        onClick={() => {
          handleAddToCart({ id, image, title, price, rating });
        }}
        className="w-full bg-primary text-white rounded px-3 py-2 text-sm sm:text-base hover:bg-primary/90 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
