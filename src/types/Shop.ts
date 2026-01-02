import { Category } from "./Categories";

export interface CategoryBreadCrumpProps {
  currentPage: string;
}

export type SidebarShopProps = {
  setCurrentPage: (page: string) => void;
  handlePriceChange: (values: any) => void;
  setShowCategories: React.Dispatch<React.SetStateAction<boolean>>;
  showCategories: boolean;
};

export interface PriceChangeParams {
  min: string;
  max: string;
}

export type FilterSidebarProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  setShowCategories: React.Dispatch<React.SetStateAction<boolean>>;
  showCategories: boolean;
  categories?: Category[];
  category_id: string | undefined;
  handlePriceChange: (values: any) => void;
};
