// src/components/auth/ResetPassword/Step1_PhoneInput.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../input/InputField'; 

interface Step1Props {
  phone: string;
  setPhone: (phone: string) => void;
  phoneError: string;
  onNext: () => void;
  onBackToLogin: () => void;
}

const Step1_PhoneInput: React.FC<Step1Props> = ({
  phone,
  setPhone,
  phoneError,
  onNext,
  onBackToLogin,
}) => {
  const { t } = useTranslation(['auth']);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">
        {t('forgotPasswordPage.title')}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-100 text-center mb-6">
        {t('forgotPasswordPage.description')}
      </p>
      <Input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder={t('forgotPasswordPage.phonePlaceholder')}
        error={!!phoneError}
      />
      {phoneError && (
        <p className="text-red-500 text-sm mt-2">{phoneError}</p>
      )}
      <button
        onClick={onNext}
        className="w-full mt-4 bg-brand-500 hover:bg-brand-600 text-white py-2 rounded-lg transition"
      >
        {t('forgotPasswordPage.submit')}
      </button>
      <button
        onClick={onBackToLogin}
        className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200"
      >
        {t('forgotPasswordPage.backToLogin')}
      </button>
    </div>
  );
};

export default Step1_PhoneInput;