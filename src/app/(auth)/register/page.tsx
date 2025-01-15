"use client";

import { Switch } from "@/components/themeToggle/auth/switch";
import { useTheme } from "next-themes";
import Image from "next/image";
import FormInputAuth from "../../../components/auth/FormInputAuth";
import ButtonAuth from "../../../components/auth/ButtonAuth";
import Card from "../../../components/auth/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "../layout";
import { FC, useEffect, useState } from "react";
import { RootState } from "@/store";
import { NewUserPayload } from "@/domain/dto/input";
import { connect } from "react-redux";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress } from "@mui/material";
import { NotificationType } from "@/domain/notification";

type RegisterPageProps = {
  loading: boolean;
  registerUser: (payload: NewUserPayload) => void;
  type: NotificationType;
  message: string;
};

const defaultValues = {
  phone: "",
  password: "",
  confirm_password: "",
  acceptedTermsAndConditions: false,
};

interface FormData {
  phone: string;
  password: string;
  confirm_password: string;
  acceptedTermsAndConditions: boolean;
}

const schema = yup.object().shape({
  phone: yup
    .string()
    .min(10, "Phone number must be atleast 10 digits")
    .required("Phone number is required"),
  password: yup.string().required("Password is required"),
  confirm_password: yup.string().required("Confirm your password"),
  acceptedTermsAndConditions: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("Accepting terms and conditions is required"),
});

const RegisterPage: FC<RegisterPageProps> & {
  layout: any;
} = ({ loading, registerUser, type, message }) => {
  const router = useRouter();
  const {
    control,
    setError,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const { phone, password, confirm_password } = data;
    registerUser({ phone, password, confirm_password } as NewUserPayload);
  };

  const { theme = "light" } = useTheme();
  const [themeMode, setThemeMode] = useState("light");

  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  useEffect(() => {
    if (
      type === NotificationType.success &&
      message?.includes(
        "Verify your account with the OTP code sent to your phone number"
      )
    ) {
      router.push(`/verify-account?phone=${getValues("phone")}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, message]);

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center lg:flex-row">
        <div className="w-full lg:w-6/12 xl:w-5/12 flex flex-col justify-center px-8 sm:px-24 lg:px-5 xl:px-6 2xl:px-12 my-0 xl:my-12">
          <div className="flex flex-col mb-20 md:mb-16 lg:mb-10 space-y-2 lg:space-y-4">
            <div className="flex items-center justify-between">
              {/* When the theme is dark, hide this div */}
              <Link href="/" data-hide-on-theme="dark">
                <Image
                  src="/assets/logo_light.png"
                  alt="MowinBet Logo"
                  width={238}
                  height={39.29}
                  className="w-[130px] h-[45px] sm:w-[150px] sm:h-[50px] md:w-[200px] md:h-[60px]"
                />
              </Link>

              {/* When the theme is light, hide this div */}
              <Link href="/" data-hide-on-theme="light">
                <Image
                  src="/assets/logo_dark.png"
                  alt="MowinBet Logo"
                  width={238}
                  height={39.29}
                  className="w-[130px] h-[45px] sm:w-[150px] sm:h-[50px] md:w-[200px] md:h-[60px]"
                />
              </Link>
              <Switch />
            </div>
            <div className="flex-col sm:flex-row space-x-1">
              <span className="text-xs xl:text-sm text-textColor">
                Have account?
              </span>
              <Link
                href="/login"
                className="text-xs xl:text-sm text-mainColor underline underline-offset-2"
              >
                Login here
              </Link>
            </div>
          </div>
          <Card>
            <form
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col items-center text-center space-y-1.5">
                <h1 className="md:text-xl xl:text-2xl 2xl:text-2xl font-semibold">
                  Create Your Account
                </h1>
                <span className="text-xs xl:text-base font-normal text-textColor">
                  Create account to access MowinBet
                </span>
              </div>
              <div className="flex flex-col w-full space-y-3 md:space-y-4 lg:space-y-6 xl:space-y-8">
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <FormInputAuth
                      id="phone_number"
                      name="phone_number"
                      type="text"
                      placeholder="Your phone number"
                      onChange={onChange}
                      value={value}
                      error={errors?.phone?.message}
                    >
                      Phone Number
                    </FormInputAuth>
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <FormInputAuth
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Your password"
                      is_password={true}
                      onChange={onChange}
                      value={value}
                      error={errors?.password?.message}
                    >
                      Password
                    </FormInputAuth>
                  )}
                />
                <Controller
                  name="confirm_password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <FormInputAuth
                      id="confirm_password"
                      name="confirm_password"
                      type="confirm_password"
                      placeholder="Your password"
                      is_password={true}
                      onChange={onChange}
                      value={value}
                      error={errors?.confirm_password?.message}
                    >
                      Confirm Password
                    </FormInputAuth>
                  )}
                />
              </div>
              <div className="flex flex-col w-full mt-3">
                <div className="flex items-start justify-start gap-2 md:gap-3 mt-5 mb-5">
                  <Controller
                    name="acceptedTermsAndConditions"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <input
                        type="checkbox"
                        name="tnc"
                        id="tnc"
                        className="peer w-[14px] h-[14px] sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px] shrink-0"
                        onChange={onChange}
                      />
                    )}
                  />
                  <div className="flex flex-row items-start text-start space-x-1 -mt-[4px]">
                    <span
                      className={`text-xs xl:text-sm leading-relaxed ${
                        themeMode === "light"
                          ? "text-textColor2"
                          : "text-textColor"
                      }`}
                    >
                      By checking this message, I hereby confirm that I agree
                      with the
                      <Link
                        href="#"
                        className="ms-1 text-xs xl:text-sm text-mainColor underline underline-offset-2"
                      >
                        Terms of Service
                      </Link>{" "}
                      the{" "}
                      <Link
                        href="#"
                        className="ms-1 text-xs xl:text-sm text-mainColor underline underline-offset-2"
                      >
                        Privacy Policy,
                      </Link>{" "}
                      that I am 18 years old or over and that all information
                      given is true.
                    </span>
                  </div>
                </div>
                {errors?.acceptedTermsAndConditions?.message && (
                  <p className="text-red-500 mb-4">
                    {errors?.acceptedTermsAndConditions?.message}
                  </p>
                )}
                <ButtonAuth
                  type="submit"
                  disabled={Object.keys(errors).length > 0}
                >
                  {loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    "Register"
                  )}
                </ButtonAuth>
              </div>
            </form>
          </Card>
        </div>
        <div className="hidden lg:w-6/12 lg:block lg:self-center xl:w-7/12 pr:4 py-4 xl:py-7 xl:pr-7">
          <div className="lg:shrink-0">
            <Image
              src={`/assets/img_bg_auth.png`}
              alt={`Image Background Auth`}
              width={1030}
              height={900}
              className="w-full h-full object-fill"
            />
          </div>
        </div>
      </div>
    </>
  );
};

RegisterPage.layout = AuthLayout;

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  const { message, type } = state.alert;
  return { loading, message, type };
};

const mapDispatchToProps = (dispatch: any) => ({
  registerUser: (payload: NewUserPayload) =>
    dispatch.authentication.register(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
