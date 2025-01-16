"use client";

import { Switch } from "@/components/themeToggle/auth/switch";
import Image from "next/image";
import FormInputAuth from "../../../components/auth/FormInputAuth";
import ButtonAuth from "../../../components/auth/ButtonAuth";
import Card from "../../../components/auth/Card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "../layout";
import { RootState } from "@/store";
import { UserCredentials } from "@/domain/auth";
import { connect } from "react-redux";
import { FC, ReactNode, useEffect } from "react";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress } from "@mui/material";
import { getToken } from "@/utilities/auth.cookie";

type LoginPageProps = {
  loading: boolean;
  isLoggedIn: boolean;
  signIn: (payload: UserCredentials) => void;
  message: string;
  authData: any;
  getUserProfile: () => void;
};

const defaultValues = {
  phone: "",
  password: "",
};

interface FormData {
  phone: string;
  password: string;
}

const schema = yup.object().shape({
  phone: yup
    .string()
    .min(10, "Phone number must be atleast 10 digits")
    .required("Phone number is required"),
  password: yup.string().required("Password is required"),
});

const LoginPage: FC<LoginPageProps> & {
  layout: any;
} = ({ loading, isLoggedIn, signIn, message, authData, getUserProfile }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const { phone, password } = data;
    signIn({ phone, password } as UserCredentials);
  };

  useEffect(() => {
    if (getToken()) {
      getUserProfile();
      const redirectUrl = searchParams.get("redirect");
      redirectUrl ? router.push(`/${redirectUrl}`) : router.push("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, authData]);

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
                Don&rsquo;t have an account?
              </span>
              <Link
                href="/register"
                className="text-xs xl:text-sm text-mainColor underline underline-offset-2"
              >
                Register here
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
                  Login To Your Account
                </h1>
                <span className="text-xs xl:text-base font-normal text-textColor">
                  Welcome back! Please provide your details to continue
                </span>
              </div>
              <div className="flex flex-col w-full space-y-2">
                <div className="flex flex-col space-y-3 md:space-y-4 lg:space-y-6 xl:space-y-8">
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
                </div>
                <div className="flex justify-end space-x-1">
                  <span className="text-textColor text-xs xl:text-sm">
                    Forgot password?
                  </span>
                  <Link
                    href="/forgot-password"
                    className="text-mainColor text-xs xl:text-sm underline underline-offset-2"
                  >
                    Reset here
                  </Link>
                </div>
              </div>
              <div className="flex flex-col w-full mt-3">
                <ButtonAuth type="submit">
                  {loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    "login"
                  )}
                </ButtonAuth>
                <div className="flex flex-row justify-center text-center space-x-1 mt-4">
                  <span className="text-xs xl:text-sm text-textColor">
                    By logging in, you agree to our
                    <Link
                      href="#"
                      className="ms-1 text-xs xl:text-sm text-mainColor underline underline-offset-2"
                    >
                      Terms of Service
                    </Link>
                  </span>
                </div>
              </div>
            </form>
          </Card>
        </div>
        <div className="hidden lg:w-6/12 lg:block lg:self-center xl:w-7/12 pr:4 py-4 xl:py-7 xl:pr-7">
          <div className="lg:shrink-0">
            <Image
              src={`/assets/logo.svg`}
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

LoginPage.layout = AuthLayout;

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  const { isLoggedIn, authData } = state.authentication;
  const { message } = state.alert;
  return { loading, isLoggedIn, message, authData };
};

const mapDispatchToProps = (dispatch: any) => ({
  signIn: (credentials: UserCredentials) =>
    dispatch.authentication.signIn(credentials),
  getUserProfile: () => dispatch.profile.getUserProfile(),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
