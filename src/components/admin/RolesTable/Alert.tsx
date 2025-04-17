import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { deleteRole } from "../../../api/rolesApi/_requests";
import "./alert.css";

export const alertDelete = (
  id: number,
  setData: React.Dispatch<React.SetStateAction<any[]>>,
  data: any[]
) => {
  Swal.fire({
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
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteRole(id);

        setData(data.filter((item) => item.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "Admin has been deleted.",
          icon: "success",
        });
      } catch (error) {
        console.error("Error deleting admin:", error);
        Swal.fire({
          title: "Error!",
          text: "There was an error deleting the user.",
          icon: "error",
        });
      }
    }
  });
};
