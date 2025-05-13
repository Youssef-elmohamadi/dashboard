import Swal from "sweetalert2";
import "./alert.css";

type Props = {
  id: number;
  getStatus: (id: number) => Promise<string>;
  changeStatus: (id: number, payload: { status: string }) => Promise<any>;
  options: { [key: string]: string };
  Texts: {
    title: string;
    inputPlaceholder: string;
    errorSelect: string;
    success: string; // يمكن استخدام {{status}} بداخل النص
    noChangeMessage: string;
    errorResponse: string;
    confirmButtonText: string;
    cancelButtonText: string;
  };
};

export const openChangeStatusModal = async ({
  id,
  getStatus,
  changeStatus,
  options,
  Texts,
}: Props) => {
  try {
    const currentStatusRaw = await getStatus(id);

    const matchedKey = Object.keys(options).find(
      (key) => key.toLowerCase() === currentStatusRaw.toLowerCase()
    );

    const { value: newStatus } = await Swal.fire({
      title: Texts.title,
      input: "select",
      inputOptions: options,
      inputValue: matchedKey,
      inputPlaceholder: Texts.inputPlaceholder,
      showCancelButton: true,
      confirmButtonText: Texts.confirmButtonText,
      cancelButtonText: Texts.cancelButtonText,
      inputValidator: (value) => (!value ? Texts.errorSelect : undefined),
      customClass: { popup: "custom-popup" },
    });

    if (
      newStatus &&
      newStatus.toLowerCase() !== currentStatusRaw.toLowerCase()
    ) {
      // ✅ إرسال الـ status في كائن يحتوي على مفتاح status كما هو مطلوب
      await changeStatus(id, { status: newStatus.toLowerCase() });

      Swal.fire({
        icon: "success",
        title: Texts.success.replace("{{status}}", newStatus),
        confirmButtonText: Texts.confirmButtonText,
      });
    } else if (newStatus === matchedKey) {
      Swal.fire({
        icon: "info",
        title: Texts.noChangeMessage,
        confirmButtonText: Texts.confirmButtonText,
      });
    }
  } catch (error: any) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: Texts.errorResponse,
      text: error.response?.data?.message || "",
      confirmButtonText: Texts.confirmButtonText,
    });
  }
};
