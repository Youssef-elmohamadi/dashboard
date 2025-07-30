// src/components/auth/ResetPassword/Step3_NewPassword.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EyeCloseIcon, EyeIcon } from '../../../icons'; // تأكد من المسار الصحيح للأيقونات
import Input from '../input/InputField'; // تأكد من المسار الصحيح

interface Step3Props {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  passwordError: string;
  onResetPassword: () => void;
}

const Step3_NewPassword: React.FC<Step3Props> = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  onResetPassword,
}) => {
  const { t } = useTranslation(['auth']);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">
        {t('forgotPasswordPage.resetPassword')}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-300 text-center mb-6">
        {t('forgotPasswordPage.enterAndConfirmPassword')}
      </p>
      <div className="relative mb-2">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder={t('forgotPasswordPage.newPasswordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute z-30 -translate-y-1/2 cursor-pointer top-1/2 ${
            document.documentElement.dir === 'rtl' ? 'left-4' : 'right-4'
          }`}
        >
          {showPassword ? (
            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
          ) : (
            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
          )}
        </span>
      </div>
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t('forgotPasswordPage.confirmPasswordPlaceholder')}
        />
        {passwordError && (
          <p className="text-red-500 text-sm mt-2">{passwordError}</p>
        )}
        <span
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute z-30 -translate-y-1/2 cursor-pointer top-1/2 ${
            document.documentElement.dir === 'rtl' ? 'left-4' : 'right-4'
          }`}
        >
          {showPassword ? (
            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
          ) : (
            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
          )}
        </span>
      </div>
      <button
        onClick={onResetPassword}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {t('forgotPasswordPage.resetPasswordBtn')}
      </button>
    </div>
  );
};

export default Step3_NewPassword;