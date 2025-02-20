"use client";

import { Switch } from "@/components/themeToggle/auth/switch";
import Image from "next/image";
import FormInputAuth from "../../../components/auth/FormInputAuth";
import ButtonAuth from "../../../components/auth/ButtonAuth";
import Card from "../../../components/auth/Card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/store";
import { UserCredentials } from "@/domain/auth";
import { connect } from "react-redux";
import { FC, ReactNode, useEffect } from "react";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress } from "@mui/material";
import { getToken } from "@/utilities/auth.cookie";
import { ModalID } from "@/domain/components";
import { Key, KeyRound, KeySquare, Lock, Phone, User } from "lucide-react";
import { NotificationType } from "@/domain/notification";
// import { useGoogleLogin } from "@/lib/hooks/useGoogleAuth";

type LoginModalContentProps = {
  emailPassowrdLoginRequestProcessing: boolean;
  isLoggedIn: boolean;
  signIn: (payload: UserCredentials) => void;
  message: string;
  authData: any;
  getUserProfile: () => void;
  setActiveModal: (modalId: ModalID) => void;
  type: NotificationType;
  googleLoginRequestProcessing: boolean;
};

const defaultValues = {
  phone_number: "",
  password: "",
};

export interface FormData {
  phone_number: string;
  password: string;
}

export const schema = yup.object().shape({
  phone_number: yup
    .string()
    .min(10, "Phone number must be atleast 10 digits")
    .required("Phone number is required"),
  password: yup.string().required("Password is required"),
});

const LoginModalContent: FC<LoginModalContentProps> = ({
  emailPassowrdLoginRequestProcessing,
  isLoggedIn,
  signIn,
  message,
  authData,
  getUserProfile,
  setActiveModal,
  type,
  googleLoginRequestProcessing
}) => {
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
    const { phone_number, password } = data;
    signIn({ phone_number, password } as UserCredentials);
  };
  // const { login } = useGoogleLogin();

  useEffect(() => {
    return () => {
      const redirect = searchParams?.get("redirect");
      if (
        type === NotificationType.success &&
        message === "Login successful!"
      ) {
        if (redirect) {
          router.push(`/${redirect}`);
        }
      }
    };
  }, [type, message]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-3">
        <Image
          src="/assets/logo.svg"
          alt="Fullbooker Logo"
          width={200}
          height={40}
          className="mx-auto"
        />
        <div className="text-center items-center mb-2 flex justify-center">
          <h2 className="text-sm font-semibold border-b-2 border-darkOrange w-[50%]">
            Sign In
          </h2>
        </div>
      </div>

      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Controller
            name="phone_number"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <FormInputAuth
                id="phone_number"
                name="phone_number"
                type="text"
                placeholder="Phone Number"
                onChange={onChange}
                value={value}
                icon={<Phone className="w-4 h-4 text-white fill-gray-500" />}
                error={errors?.phone_number?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <FormInputAuth
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                onChange={onChange}
                value={value}
                icon={<KeyRound className="w-4 h-4 text-white fill-gray-500" />}
                is_password={true}
                error={errors?.password?.message}
              />
            )}
          />

          <div className="text-center mb-3">
            <button className="text-sm mb-10 font-thin">
              Forgot password? Reset
              <span
                className="text-blue-500"
                onClick={() => setActiveModal(ModalID.forgotPassword)}
              >
                {" "}
                here
              </span>
            </button>
            <button
              type="submit"
              className="sm:w-full xs:w-full lg:w-[80%] md:w-[80%] w-full bg-primary text-white py-2 rounded-md mb-2"
            >
              {emailPassowrdLoginRequestProcessing ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          <div className="relative my-6 mx-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-dark-500">Or</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-sm py-2 flex items-center justify-center gap-2 bg-gray-100 font-thin text-sm hover:bg-gray-50 shadow-md"
            // onClick={() => login()}
          >
            <Image
              src="/assets/google-icon.png"
              alt="Google"
              width={20}
              height={20}
            />
            {googleLoginRequestProcessing ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Sign in with Google"
            )}
          </button>

          <button
            type="button"
            className="w-full rounded-sm py-2 flex items-center justify-center gap-2 bg-gray-100 font-thin text-sm hover:bg-gray-50 shadow-md"
          >
            <Image
              src="/assets/facebook-icon.png"
              alt="Facebook"
              width={28}
              height={28}
            />
            Sign in with Facebook
          </button>
        </div>
      </form>

      <div className="mt-10 text-center relative bottom-0">
        <p className="text-sm text-black font-thin mb-4">
          <span>Don't have an account?</span>
        </p>
        <button
          onClick={() => setActiveModal(ModalID.register)}
          className="sm:w-full xs:w-full lg:w-[80%] md:w-[80%] w-full bg-primary text-white py-2 rounded-md"
        >
          Create an account
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const googleLoginRequestProcessing =
  state.loading.effects.authentication.googleSocialSignin;
  const emailPassowrdLoginRequestProcessing = state.loading.effects.authentication.signIn;
  const { isLoggedIn, authData } = state.authentication;
  const { message, type } = state.alert;
  return { emailPassowrdLoginRequestProcessing, isLoggedIn, message, authData, type, googleLoginRequestProcessing };
};

const mapDispatchToProps = (dispatch: any) => ({
  signIn: (credentials: UserCredentials) =>
    dispatch.authentication.signIn(credentials),
  getUserProfile: () => dispatch.profile.getUserProfile(),
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModalContent);
