export type AdminInfo = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
  confirm_password: string;
};
export type VendorInfo = {
  name: string;
  email: string;
  phone: string;
};

export type DocumentInfo = {
  document_file: File | null;
  document_type: "1" | "2";
};
export type Steps = {
  label: string;
  number: number;
}[];
export type FormattedErrors = {
  [key: string]: string[];
};

export type ServerErrors = {
  general: string;
  global: string;
  errors: FormattedErrors;
};

export type ClientErrors = {
  [key: string]: string;
};

export type HandleChangeFn = (
  e: React.ChangeEvent<HTMLInputElement>,
  section: string
) => void;
export type HandleFileChangeFn = (file: File | null, type: "1" | "2") => void;

export type BasicInfoFormProps = {
  adminInfo: AdminInfo;
  serverErrors: ServerErrors;
  handleChange: HandleChangeFn;
  clientErrors: ClientErrors;
};

export type BreadCrumpProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

export type FormDataType = {
  adminInfo: AdminInfo;
  vendorInfo: VendorInfo;
  documentInfo: DocumentInfo[];
};

export type SetErrorsFn = (errors: { [key: string]: string }) => void;
