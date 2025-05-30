type ProductImage = {
  image: string;
};
export type Product = {
  id: string;
  name: string;
  images: ProductImage[];
  price: number;
  rating: number;
  is_fav: string;
};
