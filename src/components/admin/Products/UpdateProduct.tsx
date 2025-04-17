import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Checkbox from "../../form/input/Checkbox";
import { getAllCategories } from "../../../api/categoryApi/_requests";
import FileInput from "../../form/input/FileInput";
import { updateProduct } from "../../../api/products/_requests";

type Category = {
  id: number;
  name: string;
  description: string | number | null;
  image?: [] | null;
};

type Brand = {
  id: number;
  name: string;
  status: string;
  images: string;
};

type Product = {
  id: number;
  vendor_id: number;
  name: string;
  description: string | number | undefined;
  category_id: number;
  brand_id: number;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  status: string;
  is_featured: boolean;
  rating: number | null;
  views_count: number | null;
  created_at: string;
  updated_at: string;
  category: Category;
  brand: Brand;
  attributes: any[];
  images?: string[];
  tags: string[];
  variants: any[];
};

type Attribute = {
  label: string;
  value: string;
};

type UpdateProductProps = {
  product: Product;
  onClose: () => void;
  isEditModalOpen: boolean;
};

const UpdateProduct: React.FC<UpdateProductProps> = ({
  product,
  onClose,
  isEditModalOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<Product>(product);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isEditModalOpen) {
      setProductData(product);
      setTags(product.tags);
      setAttributes(
        product.attributes?.map((attr: any) => ({
          label: attr.attribute_name,
          value: attr.attribute_value,
        }))
      );
      setExistingImages(product.images ?? []);
    }
  }, [isEditModalOpen, product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages((prev) => [...prev, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  const handleAttributeChange = (
    index: number,
    field: keyof Attribute,
    value: string
  ) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { label: "", value: "" }]);
  };

  const addTag = () => {
    setTags([...tags, ""]);
  };

  const handleTagChange = (index: number, value: string) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.data) {
          const categories = response.data.data.original;
          setCategories(categories);
        } else {
          console.error("Data not available in response");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key !== "is_featured" && key !== "slug" && value) {
        formData.append(key, value.toString());
      }
    });

    formData.append("is_featured", productData.is_featured ? "1" : "0");

    images.forEach((image) => {
      formData.append("images[]", image);
    });

    attributes.forEach((attr, i) => {
      formData.append(`attributes[${i}][name]`, attr.label);
      formData.append(`attributes[${i}][value]`, attr.value);
    });

    tags.forEach((tag, i) => formData.append(`tags[${i}]`, tag));

    try {
      await updateProduct(formData, productData.id);
      onClose();
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };
  console.log(tags);

  return (
    <>
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-[#00000080] p-4 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Fixed Header */}
            <div className="flex justify-between items-center p-5 border-b bg-white rounded-t-xl shadow dark:bg-gray-800 dark:border-gray-700 border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Product
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-6 py-4 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      name="name"
                      value={productData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      type="string"
                      name="price"
                      value={productData.price}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      type="string"
                      name="stock_quantity"
                      value={productData.stock_quantity}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category_id">Category</Label>
                    <select
                      name="category_id"
                      value={productData.category_id}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="brand_id">Brand</Label>
                    <Input
                      name="brand_id"
                      value={productData.brand_id}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      name="description"
                      value={productData.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      name="status"
                      value={productData.status}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full dark:bg-gray-700 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    <Label htmlFor="is_featured">Featured</Label>
                    <Checkbox
                      checked={productData.is_featured}
                      onChange={(checked) =>
                        setProductData((prev) => ({
                          ...prev,
                          is_featured: checked,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <Label>Existing Images</Label>
                    <div className="flex gap-3 mt-3 flex-wrap">
                      {existingImages.map((src, index) => (
                        <img
                          key={`existing-${index}`}
                          src={src}
                          alt={`Existing ${index}`}
                          className="h-20 w-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* New Image Upload */}
                <div>
                  <Label>Upload New Images</Label>
                  <FileInput multiple={true} onChange={handleImageChange} />
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {imagePreviews.map((src, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img
                          src={src}
                          alt={`Preview ${index}`}
                          className="h-20 w-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPreviews = [...imagePreviews];
                            const updatedFiles = [...images];
                            updatedPreviews.splice(index, 1);
                            updatedFiles.splice(index, 1);
                            setImagePreviews(updatedPreviews);
                            setImages(updatedFiles);
                          }}
                          className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attributes */}
                <div>
                  <Label>Attributes</Label>
                  {attributes.map((attr, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Label"
                        value={attr.label}
                        onChange={(e) =>
                          handleAttributeChange(index, "label", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Value"
                        value={attr.value}
                        onChange={(e) =>
                          handleAttributeChange(index, "value", e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAttribute}
                    className="text-blue-500 mt-1"
                  >
                    + Add Attribute
                  </button>
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  {tags.map((tag, index) => (
                    <div key={index} className="mb-2">
                      <Input
                        placeholder="Tag"
                        value={tag.name}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTag}
                    className="text-blue-600 hover:underline mt-2"
                  >
                    + Add Tag
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                  >
                    {loading ? "Updating..." : "Update Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateProduct;
