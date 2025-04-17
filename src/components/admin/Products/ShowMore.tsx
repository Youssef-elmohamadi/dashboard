import React from "react";

type Category = {
  id: number;
  name: string;
  description: string;
};

type Brand = {
  id: number;
  name: string;
  status: string;
  image: string;
};

type Product = {
  id: number;
  vendor_id: number;
  name: string;
  slug: string;
  description: string | null;
  category_id: number;
  brand_id: number;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  status: string;
  is_featured: number;
  rating: number | null;
  views_count: number | null;
  created_at: string;
  updated_at: string;
  category: Category;
  brand: Brand;
  attributes: any[];
  images: string[];
  tags: string[];
  variants: any[];
};

type UpdateProductProps = {
  product: Product | null;
  onClose: () => void;
  isShowModalOpen: boolean;
};

const UpdateProduct: React.FC<UpdateProductProps> = ({
  product,
  onClose,
  isShowModalOpen,
}) => {
  if (!isShowModalOpen || !product) return null;

  return (
    <div
      style={{ zIndex: 99999 }}
      className="fixed top-0 left-0 right-0 flex justify-center items-center w-full h-screen bg-[#00000080]"
    >
      <div className="relative p-4 w-full max-w-3xl h-[90vh]">
        <div className="relative bg-white rounded-xl shadow-lg dark:bg-gray-800 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Product Details
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 hover:bg-gray-200 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-auto space-y-4 text-sm text-gray-800 dark:text-gray-200 flex-grow">
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>ID:</strong> {product.id}
              </p>
              <p>
                <strong>Vendor ID:</strong> {product.vendor_id}
              </p>
              <p>
                <strong>Name:</strong> {product.name}
              </p>
              <p>
                <strong>Slug:</strong> {product.slug}
              </p>
              <p>
                <strong>Price:</strong> {product.price} EGP
              </p>
              <p>
                <strong>Discount:</strong> {product.discount_price ?? "N/A"}
              </p>
              <p>
                <strong>Stock:</strong> {product.stock_quantity}
              </p>
              <p>
                <strong>Status:</strong> {product.status}
              </p>
              <p>
                <strong>Featured:</strong> {product.is_featured ? "Yes" : "No"}
              </p>
              <p>
                <strong>Rating:</strong> {product.rating ?? "N/A"}
              </p>
              <p>
                <strong>Views:</strong> {product.views_count ?? "N/A"}
              </p>
              <p>
                <strong>Category:</strong> {product.category?.name}
              </p>
              <p>
                <strong>Brand:</strong> {product.brand?.name}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(product.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Updated:</strong>{" "}
                {new Date(product.updated_at).toLocaleString()}
              </p>
            </div>

            <div>
              <strong>Description:</strong>
              <p className="mt-1">{product.description || "No description"}</p>
            </div>

            <div>
              <strong>Tags:</strong>
              <ul className="list-disc pl-6 mt-1">
                {product.tags.length > 0 ? (
                  product.tags.map((tag, i) => <li key={i}>{tag.name}</li>)
                ) : (
                  <li>No tags</li>
                )}
              </ul>
            </div>

            <div>
              <strong>Attributes:</strong>
              <ul className="list-disc pl-6 mt-1">
                {product.attributes.length > 0 ? (
                  product.attributes.map((attr, i) => (
                    <li key={i}>
                      {attr.attribute_name}: {attr.attribute_value}
                    </li>
                  ))
                ) : (
                  <li>No attributes</li>
                )}
              </ul>
            </div>

            {/* <div>
              <strong>Variants:</strong>
              <ul className="list-disc pl-6 mt-1">
                {product.variants.length > 0 ? product.variants.map((v, i) => (
                  <li key={i}>{JSON.stringify(v)}</li>
                )) : <li>No variants</li>}
              </ul>
            </div> */}

            <div>
              <strong>Images:</strong>
              <div className="flex flex-wrap gap-3 mt-2">
                {product.images.length > 0 ? (
                  product.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Product Image ${i + 1}`}
                      className="w-24 h-24 object-cover rounded border"
                    />
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-right">
            <button
              onClick={onClose}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg px-5 py-2 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
