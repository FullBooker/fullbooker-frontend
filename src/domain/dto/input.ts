export type CreatePatientPayload = {
  patient_id: string;
  patient_alternate_id: string;
  first_name: string;
  last_name: string;
  middle_initial?: string;
  nick_name?: string;
  email: string;
  mobile_phone: string;
  home_phone: string;
  work_phone: string | null;
  work_phone_extension?: string | null;
  sex: string;
  dob: string;
  birth_weight?: string;
  weight_unit?: string;
  new_born: boolean;
  ssn: string;
  marital_status: string;
  admission_date: string;
  notes?: string;
  languages?: string[];
};

export type CreatePatientAddressPayload = {
  patient: string;
  address_id?: string;
  address: string;
  state: string;
  city: string;
  zip_code: string;
  is_default: boolean;
};

export type CreatePatientCPTPayload = {
  patient: string;
  cpt: string;
  code: string;
  description: string;
  poa: string;
  is_default: boolean;
};

export type CreatePatientICDPayload = {
  patient: string;
  icd: string;
  code: string;
  description: string;
  amount: string;
  mod1: string;
  mod1_desc: string;
  mod2: string;
  mod2_desc: string;
  mod3: string;
  mod3_desc: string;
  poa: string;
  is_default: boolean;
};

export type CreatePatientInsuranceDetails = {
  patient: string;
  insurance: string;
  policy_start_date: string;
  policy_end_date: string;
  issured_group_name: string;
  issured_group_number: string;
  type: string;
  issured_relationship: string;
  issured_ssn: string;
  insurance_programs?: any[];
  insurance_services?: any[];
  applicable_for_all_business_types?: boolean;
  payment_source: string;
};

export type Address = {
  address_id: string;
  address: string;
  state: string;
  city: string;
  zip_code: string;
  is_default: boolean;
};

export type CreatePatientFacilityDetails = {
  patient: string;
  facility: string;
  name: string;
  address: Address;
  umpi: string;
  taxonomy: string;
};

export type CreatePatientRevenueCodes = {
  patient: string;
  revenue_code: string;
  code: string;
  description: string;
  amount: string;
  modifier_code: string;
  modifier_desc: string;
  is_default: boolean;
};

export type UpdatePatientPayload = {
  patient_id: string;
  patient_alternate_id: string;
  first_name: string;
  last_name: string;
  middle_initial?: string;
  nick_name?: string;
  email: string;
  mobile_phone: string;
  home_phone: string;
  work_phone: string | null;
  work_phone_extension?: string | null;
  sex: string;
  dob: string;
  birth_weight?: string;
  weight_unit?: string;
  new_born: boolean;
  ssn: string;
  marital_status: string;
  admission_date: string;
  notes?: string;
  languages?: string[];
};

export type CreateEmployeePayload = {
  employee_type: string;
  first_name: string;
  last_name: string;
  middle_initial: string;
  employee_id: string;
  suffix: string;
  title: string;
  dob: string;
  mobile_number: string;
  email: string;
  telephone: string;
  fax: string;
  hourly_rate: string;
  overtime_hourly_rate: string;
  rate_applicable_for_all: boolean;
  ssn: string;
  hire_date: string;
  roaster_id: string;
  payment_method: string;
  languages: string[];
  caregiver_type: string;
};

export type CreateEmployeeAddressPayload = {
  employee: string;
  address_id: string;
  address: string;
  state: string;
  city: string;
  zip_code: string;
  is_default: boolean;
};

export type CreateEmployeeBillingDetails = {
  employee: string;
  first_name: string;
  last_name: string;
  middle_initial: string;
  email: string;
  telephone: string;
  fax: string;
  dob: string;
  mobile_number: string;
  template: string;
};

export type CreateEmployeeOtherDetails = {
  employee: string;
  state_license: string;
  tax_id: string;
  taxonomy_code: string;
  umpi: string;
};

export type UpdateEmployeePayload = {
  id: string;
  employee_type: string;
  first_name: string;
  last_name: string;
  middle_initial: string;
  employee_id: string;
  suffix: string;
  title: string;
  dob: string;
  mobile_number: string;
  email: string;
  telephone: string;
  fax: string;
  hourly_rate: string;
  overtime_hourly_rate: string;
  rate_applicable_for_all: boolean;
  ssn: string;
  hire_date: string;
  roaster_id: string;
  payment_method: string;
  languages: string[];
  caregiver_type: string;
};

export type CreateEmployeeBillingDetailsPayload = {
  employee: string;
  first_name: string;
  last_name: string;
  middle_initial: string;
  email: string;
  telephone: string;
  fax: string;
  dob: string;
  mobile_number: string;
  template: string;
};

export type UpdateInsurancePayload = {
  id: string;
  name: string;
  description: string;
  type: string;
};

export type CreateInsurancePayload = {
  name: string;
  description: string;
  type: string;
};

export type CreatePaymentSourcePayload = {
  name: string;
  description: string;
};

export type UpdatePaymentSourcePayload = {
  id: string;
  name: string;
  description: string;
};

export type CreateClaimPayload = {
  patient: string;
  employee: string;
  from: string;
  to: string;
};

export type UpdateClaimPayload = {
  claim: string;
  from?: string;
  to?: string;
  status?: string;
};

export type PatientsListFilters = {
  page: number;
  limit?: number;
  pageSize: number;
  global?: string;
  sex?: string;
  new_born?: boolean;
  marital_status?: string;
};

export type EmployeesListFilters = {
  page: number;
  limit?: number;
  pageSize: number;
  global?: string;
  caregiver_type?: string;
  employee_type?: string;
  language?: string;
};

export type ClaimsListFilters = {
  page: number;
  limit?: number;
  pageSize: number;
  global?: string;
  status?: string;
  insurance?: string;
};

export type AssignPatientsToEmployeePayload = {
  employee: string;
  patients: Array<string>;
};

// Onboarding
export type NewUserPayload = {
  phone: string;
  password: string;
  confirm_password: string;
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

export type DepositRequestPayload = {
  Amount: any;
  PaymentMethod: string;
}

export type LaunchGamePayload = {
  slug: string;
  provider_slug: string;
  isDemo: boolean;
  game_id: string;
}

export type ActiveGamePayload = {
  game_id: string;
  slug: string;
  provider_slug: string;
  isDemo: boolean
};

export type GamesTransactionsFilters = {
  page: number;
  pageSize: number;
  start_date: string;
  end_date: string;
  game_name: string;
  transaction_type: string;
  status: string;
}

export type PaymentsTransactionsFilters = {
  page: number;
  pageSize: number;
  start_date: string;
  end_date: string;
  game_name: string;
  transaction_type: string;
  status: string;
  transactionID: string;
  payment_method: string;
}

export type GamesFilters = {
  page: number;
  pageSize: number;
}

export type WithdrawalRequestPayload = {
  Amount: number;
  PaymentMethod: string;
}