import { FormDataType, SetErrorsFn } from "../../../types/Auth";

export const validateAdminForm = (
  setErrors: SetErrorsFn,
  dataForm: FormDataType,
  t: any
) => {
  const errors: Record<string, string> = {};

  if (!dataForm.adminInfo.first_name.trim()) {
    errors.firstName = t("errors.firstNameError");
  }

  if (!dataForm.adminInfo.last_name.trim()) {
    errors.lastName = t("errors.lastNameError");
  }

  if (!dataForm.adminInfo.phone.trim()) {
    errors.phoneAdmin = t("errors.phoneError");
  }

  if (!dataForm.adminInfo.email.trim()) {
    errors.emailAdmin = t("errors.emailError");
  } else if (!/\S+@\S+\.\S+/.test(dataForm.adminInfo.email)) {
    errors.emailAdmin = t("errors.emailFormatError");
  }

  if (!dataForm.adminInfo.password) {
    errors.password = t("errors.passwordError");
  } else if (dataForm.adminInfo.password.length < 8) {
    errors.password = t("errors.passwordLengthError");
  }

  if (dataForm.adminInfo.confirm_password !== dataForm.adminInfo.password) {
    errors.confirm_password = t("errors.passwordMatchError");
  }

  setErrors(errors);

  return Object.keys(errors).length === 0;
};

export const validateVendorForm = (setErrors: any, dataForm: any, t: any) => {
  const errors: Record<string, string> = {};

  if (!dataForm.vendorInfo.name.trim()) {
    errors.storeName = t("errors.storeNameError");
  }

  if (!dataForm.vendorInfo.phone.trim()) {
    errors.storePhone = t("errors.storePhoneError");
  }

  if (!dataForm.vendorInfo.email.trim()) {
    errors.storeEmail = t("errors.storeEmailError");
  } else if (!/\S+@\S+\.\S+/.test(dataForm.vendorInfo.email)) {
    errors.storeEmail = t("errors.emailFormatError");
  }

  if (!dataForm.documentInfo[0].document_file) {
    errors.commercialRegisterDocument = t(
      "errors.commercialRegisterDocumentError"
    );
  }

  if (!dataForm.documentInfo[1].document_file) {
    errors.taxRegisterDocument = t("errors.taxRegisterDocumentError");
  }

  setErrors(errors);

  return Object.keys(errors).length === 0;
};
