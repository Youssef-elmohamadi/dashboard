import { FormDataType } from "../../../types/Auth";

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
const isValidEgyptianPhone = (phone: string) =>
  /^01[0125][0-9]{8}$/.test(phone);

export const validateAdminForm = (dataForm: FormDataType, t: any) => {
  const errors: Record<string, string> = {};

  const { first_name, last_name, phone, email, password, confirm_password } =
    dataForm.adminInfo;

  if (!first_name.trim()) {
    errors.first_name = t("errors.firstNameError");
  }

  if (!last_name.trim()) {
    errors.last_name = t("errors.lastNameError");
  }

  if (!phone.trim()) {
    errors.phone = t("errors.phoneError");
  } else if (!isValidEgyptianPhone(phone)) {
    errors.phone = t("errors.phoneFormatError");
  }

  if (!email.trim()) {
    errors.email = t("errors.emailError");
  } else if (!isValidEmail(email)) {
    errors.email = t("errors.emailFormatError");
  }

  if (!password) {
    errors.password = t("errors.passwordError");
  } else if (password.length < 8) {
    errors.password = t("errors.passwordLengthError");
  }

  if (confirm_password !== password) {
    errors.confirm_password = t("errors.passwordMatchError");
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateVendorForm = (dataForm: FormDataType, t: any) => {
  const errors: Record<string, string> = {};

  const { name, phone, email } = dataForm.vendorInfo;

  if (!name.trim()) {
    errors.name = t("errors.storeNameError");
  }

  if (!phone.trim()) {
    errors.phone = t("errors.storePhoneError");
  } else if (!isValidEgyptianPhone(phone)) {
    errors.phone = t("errors.phoneFormatError");
  }

  if (!email.trim()) {
    errors.email = t("errors.storeEmailError");
  } else if (!isValidEmail(email)) {
    errors.email = t("errors.emailFormatError");
  }

  if (!dataForm.documentInfo[0]?.document_file) {
    errors.commercialRegisterDocument = t(
      "errors.commercialRegisterDocumentError"
    );
  }

  if (!dataForm.documentInfo[1]?.document_file) {
    errors.taxRegisterDocument = t("errors.taxRegisterDocumentError");
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};
