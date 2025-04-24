import Swal from "sweetalert2";

export const SweetAlert = async (message: string, afterClose?: () => void) => {
  await Swal.fire({
    position: "center-center",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 2000,
  });

  if (afterClose) {
    afterClose();
  }
};
