import { NavLink } from "react-router-dom";
import HeartIcon from "../../../icons/HeartIcon";

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
        {favoriteCount !== undefined && favoriteCount > 0 && (
          <div className="absolute -top-2 -right-2 end-user-bg-base w-5 h-5 flex justify-center items-center rounded-full text-white text-xs">
            {favoriteCount}
          </div>
        )}
        <HeartIcon />
      </NavLink>
    </div>
  );
};
