import React, { useEffect } from "react";
import {useNavigate } from "react-router";

const ProductsCompare = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("uToken");
    if (!token) {
      navigate("/signin", { replace: true });
    }
  }, []);
  return <div>ProductsCompare</div>;
};

export default ProductsCompare;
