import { MdFavorite } from "react-icons/md";
import { NavLink } from "react-router-dom";

interface FavoriteProductsIconProps {
  favoriteCount: number | undefined;
  lang: string | undefined;
}

export const FavoriteProductsIcon: React.FC<FavoriteProductsIconProps> = ({
  favoriteCount,
  lang,
}) => {
  return (
    <div className="flex items-center gap-2 relative">
      <NavLink to={`/${lang}/u-favorite`}>
        {favoriteCount !== undefined &&
          favoriteCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-purple-700 w-5 h-5 flex justify-center items-center rounded-full text-white text-xs">
              {favoriteCount}
            </div>
          )}
        <MdFavorite className="text-2xl text-secondary" />
      </NavLink>
    </div>
  );
};
