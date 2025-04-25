import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";
import FileInput from "../../../components/form/input/FileInput";
import { getAllCategories } from "../../../api/AdminApi/categoryApi/_requests";
import {
  showProduct,
  updateProduct,
} from "../../../api/AdminApi/products/_requests";
import { getAllBrands } from "../../../api/AdminApi/brandsApi/_requests";

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

type Attribute = {
  label: string;
  value: string;
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

const UpdateProductPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string>();
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productRes, categoryRes, brandRes] = await Promise.all([
          showProduct(Number(id)),
          getAllCategories(),
          getAllBrands(),
        ]);

        const product = productRes.data.data;

        setTags(
          product.tags.map((tag: any) =>
            typeof tag === "string" ? tag : tag.name
          )
        );

        setProductData(product);
        setExistingImages(product.images ?? []);
        setAttributes(
          product.attributes?.map((attr: any) => ({
            label: attr.attribute_name,
            value: attr.attribute_value,
          }))
        );
        setCategories(categoryRes.data.data.original);
        setBrands(brandRes.data.data);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    fetchInitialData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => (prev ? { ...prev, [name]: value } : null));
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

  const handleTagChange = (index: number, value: string) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };

  const addAttribute = () =>
    setAttributes([...attributes, { label: "", value: "" }]);
  const addTag = () => setTags([...tags, ""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productData) return;
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (
        key !== "is_featured" &&
        key !== "slug" &&
        key !== "images" &&
        value !== null &&
        value !== undefined &&
        key !== "tags"
      ) {
        formData.append(key, value.toString());
      }
    });

    formData.append("is_featured", productData.is_featured ? "1" : "0");
    if (images.length > 0) {
      images.forEach((image) => formData.append("images[]", image));
    }
    attributes.forEach((attr, i) => {
      formData.append(`attributes[${i}][name]`, attr.label);
      formData.append(`attributes[${i}][value]`, attr.value);
    });
    tags.forEach((tag) => {
      formData.append("tags[]", tag);
    });

    try {
      await updateProduct(formData, productData.id);
      navigate("/admin/products");
    } catch (err: any) {
      console.error(err);

      const newErrors: { [key: string]: string } = {};

      if (err?.response?.data?.errors) {
        const errorData = err.response.data.errors;
        Object.values(errorData).forEach((e: any) => {
          const field = e.code.includes(".") ? e.code.split(".")[0] : e.code;
          newErrors[field] = e.message;
        });
      }
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  if (!productData) return <div className="p-6">Loading...</div>;

  return (
    <div className="">
      <div className="p-4 border-b dark:border-gray-600 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Update Product
        </h3>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              value={productData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              name="price"
              value={productData.price}
              onChange={handleChange}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input
              name="stock_quantity"
              value={productData.stock_quantity}
              onChange={handleChange}
            />
            {errors.stock_quantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stock_quantity}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="category_id">Category</Label>
            <select
              name="category_id"
              value={productData.category_id}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full dark:bg-gray-900 dark:text-white"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>
          <div>
            <Label htmlFor="brand_id">Brand</Label>
            <select
              name="brand_id"
              value={productData.brand_id}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full dark:bg-gray-900 dark:text-white"
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.brand && (
              <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              name="description"
              value={productData.description}
              onChange={handleChange}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              name="status"
              value={productData.status}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full dark:bg-gray-900 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
            )}
          </div>
          <div className="flex items-center space-x-3 mt-1">
            <Label htmlFor="is_featured">Featured</Label>
            <Checkbox
              checked={productData.is_featured}
              onChange={(checked) =>
                setProductData((prev) =>
                  prev ? { ...prev, is_featured: checked } : prev
                )
              }
            />
            {errors.is_featured && (
              <p className="text-red-500 text-sm mt-1">{errors.is_featured}</p>
            )}
          </div>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div>
            <Label>Existing Images</Label>
            <div className="flex gap-3 mt-3 flex-wrap">
              {existingImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Existing ${i}`}
                  className="w-32 h-32 text-gray-700 dark:text-gray-400 object-cover rounded border dark:border-gray-700"
                />
              ))}
            </div>
          </div>
        )}

        {/* Upload New Images */}
        <div>
          <Label>Upload New Images</Label>
          <FileInput multiple onChange={handleImageChange} />
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images}</p>
          )}
          <div className="flex gap-3 mt-3 flex-wrap">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  alt={`Preview ${i}`}
                  className="w-32 h-32 text-gray-700 dark:text-gray-400 object-cover rounded border dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newPreviews = [...imagePreviews];
                    const newFiles = [...images];
                    newPreviews.splice(i, 1);
                    newFiles.splice(i, 1);
                    setImagePreviews(newPreviews);
                    setImages(newFiles);
                  }}
                  className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
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
          {attributes.map((attr, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input
                placeholder="Label"
                value={attr.label}
                onChange={(e) =>
                  handleAttributeChange(i, "label", e.target.value)
                }
              />
              <Input
                placeholder="Value"
                value={attr.value}
                onChange={(e) =>
                  handleAttributeChange(i, "value", e.target.value)
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
          {errors.attributes && (
            <p className="text-red-500 text-sm mt-1">{errors.attributes}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <Label>Tags</Label>
          {tags.map((tag, i) => (
            <div key={i} className="mb-2">
              <Input
                value={tag}
                onChange={(e) => handleTagChange(i, e.target.value)}
                placeholder="Tag"
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
          {errors.tags && (
            <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
          )}
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
  );
};

export default UpdateProductPage;
