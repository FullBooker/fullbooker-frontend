export type NewUserPayload = {
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
};

export type RequestOTPPayload = {
  identifier: string;
};

export type VerifyOTPPayload = {
  identifier: string;
  otp: string;
};

export type VerifyPhoneOTPPayload = {
  phone: string;
  otp: string;
};

export type ResendPhoneOTPPayload = {
  phone: string;
};

export type ForgotPasswordPayload = {
  Phone: string;
};

export type ResetPasswordPayload = {
  Phone: string;
  OTP: string;
  Password: string;
  ConfirmPassword: string;
};

export type UpdatePasswordPayload = {
  CurrentPassword: string;
  NewPassword: string;
  ConfirmPassword: string;
};

export type UpdateUserProfilePayload = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  national_id: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
};
