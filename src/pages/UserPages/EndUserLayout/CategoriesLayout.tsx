import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { ArrowDownIcon } from "../../../icons";
import { getAllCategories } from "../../../api/EndUserApi/endUserCategories/_requests";

export default function CategoriesLayout() {
  const [showCategories, setShowCategories] = useState(true);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-row min-h-screen">
      {/* SideBar */}
      <aside className="w-64 bg-gray-100 p-4 shadow">
        <button
          onClick={() => setShowCategories((prev) => !prev)}
          className="font-bold w-full  flex justify-between"
        >
          Categories
          <ArrowDownIcon
            className={`transition-transform duration-300 ${
              showCategories ? "rotate-180" : ""
            }`}
          />
        </button>
        {showCategories && (
          <ul className="mt-4 space-y-2 ">
            {categories.map((category) => (
              <li key={category.id}>
                <Link to="/">{category.name}</Link>
              </li>
            ))}
          </ul>
        )}
      </aside>
      {/* priceFilter */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
