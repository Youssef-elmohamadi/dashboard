type UserProfileFormData = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  avatar: File | null;
};

type ApiError = {
  response?: {
    data?: {
      errors?: {
        code: keyof ServerErrors;
        message: string;
      }[];
    };
  };
};

type ServerErrors = {
  first_name: string[];
  last_name: string[];
  email: string[];
  phone: string[];
  password: string[];
  password_confirmation: string[];
  avatar: string[];
  general?: string;
  global: string;
};

type ClientErrors = {
  [key in keyof Omit<UserProfileFormData, "avatar" | "id">]?: string;
};

export type { UserProfileFormData, ApiError, ServerErrors, ClientErrors };
