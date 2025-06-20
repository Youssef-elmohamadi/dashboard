export type TableAlert = {
  variant: "success" | "error" | "warning" | "info";
  message: string;
  title: string;
};

export type ID = {
  id: number | string | undefined;
};
