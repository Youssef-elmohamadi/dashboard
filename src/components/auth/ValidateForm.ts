export const validateAdminForm = (setErrors: any, dataForm: any, t: any) => {
  // First Name
  if (!dataForm.adminInfo.first_name.trim()) {
    setErrors({ firstName: t("SignErrors:firstNameError") });
    return false;
  }
  // Last Name
  if (!dataForm.adminInfo.last_name.trim()) {
    setErrors({ lastName: t("SignErrors:lastNameError") });
    return false;
  }

  // Phone Admin
  if (!dataForm.adminInfo.phone.trim()) {
    setErrors({ phoneAdmin: t("SignErrors:phoneError") });
    return false;
  }
  // Email Admin
  if (!dataForm.adminInfo.email.trim()) {
    setErrors({ emailAdmin: t("SignErrors:emailError") });
    return false;
  } else if (!/\S+@\S+\.\S+/.test(dataForm.adminInfo.email)) {
    setErrors({ emailAdmin: t("SignErrors:emailFormatError") });
    return false;
  }
  // Password
  if (!dataForm.adminInfo.password) {
    setErrors({ password: t("SignErrors:passwordError") });
    return false;
  }
  if (dataForm.adminInfo.password.length < 8) {
    setErrors({ password: t("SignErrors:passwordLengthError") });
    return false;
  }

  if (dataForm.adminInfo.confirm_password !== dataForm.adminInfo.password) {
    setErrors({ confirm_password: t("SignErrors:passwordMatchError") });
    return false;
  }

  setErrors({});
  return true;
};

export const validateVendorForm = (setErrors: any, dataForm: any, t: any) => {
  // Store Name
  if (!dataForm.vendorInfo.name.trim()) {
    setErrors({ storeName: t("SignErrors:storeNameError") });
    return false;
  }
  // Store Phone
  if (!dataForm.vendorInfo.phone.trim()) {
    setErrors({ storePhone: t("SignErrors:storePhoneError") });
    return false;
  }
  // Store Email
  if (!dataForm.vendorInfo.email.trim()) {
    setErrors({ storeEmail: t("SignErrors:storeEmailError") });
    return false;
  } else if (!/\S+@\S+\.\S+/.test(dataForm.vendorInfo.email)) {
    setErrors({ storeEmail: t("SignErrors:emailFormatError") });
    return false;
  }
  // Document
  if (!dataForm.documentInfo[0].document_file) {
    setErrors({ document: t("SignErrors:documentError") });
    return false;
  }

  if (!dataForm.documentInfo[1].document_file) {
    setErrors({ document: t("SignErrors:documentError") });
    return false;
  }
  setErrors({});
  return true;
};
