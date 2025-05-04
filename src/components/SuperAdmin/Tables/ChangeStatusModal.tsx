import Swal from "sweetalert2";

type Props = {
  id: number;
  getStatus: (id: number) => Promise<string>;
  changeStatus: (id: number, payload: { status: string }) => Promise<any>;
  options: { [key: string]: string };
};

export const openChangeStatusModal = async ({
  id,
  getStatus,
  changeStatus,
  options,
}: Props) => {
  try {
    const currentStatusRaw = await getStatus(id);

    const matchedKey = Object.keys(options).find(
      (key) => key.toLowerCase() === currentStatusRaw.toLowerCase()
    );

    const { value: newStatus } = await Swal.fire({
      title: "Change Status",
      input: "select",
      inputOptions: options,
      inputValue: matchedKey, // ← ده المفتاح اللي بيعمل pre-fill
      inputPlaceholder: "Select a status",
      showCancelButton: true,
      inputValidator: (value) =>
        !value ? "You need to select a status" : undefined,
    });

    if (
      newStatus &&
      newStatus.toLowerCase() !== currentStatusRaw.toLowerCase()
    ) {
      await changeStatus(id, { status: newStatus.toLowerCase() });
      Swal.fire({
        icon: "success",
        title: `Status updated to: ${newStatus}`,
      });
    } else if (newStatus === matchedKey) {
      Swal.fire("No change made", "", "info");
    }
  } catch (error: any) {
    console.error(error);
    Swal.fire(
      "Something went wrong",
      error.response.data.message || "",
      "error"
    );
  }
};
