import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import "./alert.css";

interface AlertMessages {
  confirmTitle?: string;
  confirmText?: string;
  confirmButtonText?: string;
  successTitle?: string;
  successText?: string;
  errorTitle?: string;
  errorText?: string;
}

export const alertDelete = async (
  id: number,
  apiFn: (id: number) => Promise<any>,
  refetchFn: () => Promise<any>,
  messages?: AlertMessages
): Promise<any> => {
  const {
    confirmTitle = "Are you sure?",
    confirmText = "You won't be able to revert this!",
    confirmButtonText = "Yes, delete it!",
    successTitle = "Deleted!",
    successText = "Item has been deleted.",
    errorTitle = "Error!",
    errorText = "There was an error deleting the item.",
  } = messages || {};

  const result = await Swal.fire({
    title: confirmTitle,
    text: confirmText,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText,
    customClass: { popup: "custom-popup" },
  });

  if (result.isConfirmed) {
    try {
      await apiFn(id);
      const updated = await refetchFn();
      Swal.fire({ title: successTitle, text: successText, icon: "success" });
      return updated;
    } catch (error) {
      console.error("Error deleting item:", error);
      Swal.fire({ title: errorTitle, text: errorText, icon: "error" });
    }
  }
};
