import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import "./alert.css";

interface AlertMessages {
  confirmTitle?: string;
  confirmText?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
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
    cancelButtonText = "Cancel",
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
    cancelButtonText,
    customClass: { popup: "custom-popup" },
  });

  if (result.isConfirmed) {
    try {
      await apiFn(id);
      const updated = await refetchFn();
      Swal.fire({
        title: successTitle,
        text: successText,
        icon: "success",
        customClass: { popup: "custom-popup" },
      });
      return updated;
    } catch (error: any) {
      console.error("Error deleting item:", error);
      const status = error?.response?.status;
      let globalError = "";

      if (status === 401 || status === 403) {
        globalError = "You don't have permission to delete.";
      } else if (status === 422) {
        const validationErrors = error?.response?.data?.errors;
        globalError =
          validationErrors && typeof validationErrors === "object"
            ? Object.values(validationErrors)[0][0]
            : "Invalid input.";
      } else if (status === 500) {
        globalError = "Something went wrong on the server.";
      } else {
        globalError = errorText;
      }

      Swal.fire({
        title: errorTitle,
        text: globalError,
        icon: "error",
        customClass: { popup: "custom-popup" },
      });
    }
  }
};
