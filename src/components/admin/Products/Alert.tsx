import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { deleteProduct } from "../../../api/products/_requests";
import "./alert.css";

export const alertDelete = async (id: number): Promise<boolean> => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    customClass: {
      popup: "custom-popup",
    },
  });

  if (result.isConfirmed) {
    try {
      await deleteProduct(id);
      await Swal.fire({
        title: "Deleted!",
        text: "Admin has been deleted.",
        icon: "success",
      });
      return true;
    } catch (error) {
      console.error("Error deleting admin:", error);
      await Swal.fire({
        title: "Error!",
        text: "There was an error deleting the user.",
        icon: "error",
      });
      return false;
    }
  }
  return false;
};
