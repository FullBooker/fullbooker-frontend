"use client";

import { Switch } from "@/components/themeToggle/auth/switch";
import { useTheme } from "next-themes";
import Image from "next/image";
import FormInputAuth from "../../../components/auth/FormInputAuth";
import ButtonAuth from "../../../components/auth/ButtonAuth";
import Card from "../../../components/auth/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { RootState } from "@/store";
import { NewUserPayload } from "@/domain/dto/input";
import { connect } from "react-redux";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress } from "@mui/material";
import { NotificationType } from "@/domain/notification";
import {
  User,
  Lock,
  MailCheck,
  KeyRound,
  UserCheck,
  Phone,
  Mail,
} from "lucide-react";
import { Facebook } from "lucide-react";
import { Chrome } from "lucide-react";
import { ModalID } from "@/domain/components";
import { useGoogleLogin } from "@/lib/hooks/useGoogleAuth";
import Button from "@/components/shared/button";

type RegisterModalContentProps = {
  googleRegisterRequestProcessing: boolean;
  emailPassowrdRegisterRequestProcessing: boolean;
  registerUser: (payload: NewUserPayload) => void;
  type: NotificationType;
  message: string;
  setActiveModal: (modalId: ModalID) => void;
};

const defaultValues = {
  phone_number: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  confirm_password: "",
};

interface FormData {
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
}

const schema = yup.object().shape({
  phone_number: yup
    .string()
    .min(10, "Phone number must be atleast 10 digits")
    .required("Phone number is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  password: yup.string().required("Password is required"),
  confirm_password: yup
    .string()
    .required("Confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const RegisterModalContent: FC<RegisterModalContentProps> = ({
  googleRegisterRequestProcessing,
  emailPassowrdRegisterRequestProcessing,
  registerUser,
  type,
  message,
  setActiveModal,
}) => {
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
    const {
      phone_number,
      email,
      first_name,
      last_name,
      password,
      confirm_password,
    } = data;
    registerUser({
      phone_number,
      email,
      first_name,
      last_name,
      password,
      confirm_password,
    } as NewUserPayload);
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
      router.push(`/verify-account?phone=${getValues("phone_number")}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, message]);

  const { login: register } = useGoogleLogin();

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
            Sign Up
          </h2>
        </div>
      </div>

      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Controller
            name="first_name"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <FormInputAuth
                type="text"
                placeholder="First Name"
                value={value}
                onChange={onChange}
                error={errors.first_name?.message}
                name="first_name"
                id="first_name"
                icon={
                  <UserCheck className="w-4 h-4 text-gray-500 fill-gray-500" />
                }
              />
            )}
          />

          <Controller
            name="last_name"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <FormInputAuth
                type="text"
                placeholder="Last Name"
                value={value}
                onChange={onChange}
                error={errors.last_name?.message}
                id="last_name"
                name="last_name"
                icon={
                  <UserCheck className="w-4 h-4 text-gray-500 fill-gray-500" />
                }
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <FormInputAuth
                type="text"
                placeholder="Email"
                value={value}
                onChange={onChange}
                error={errors.email?.message}
                id="email"
                name="email"
                icon={<Mail className="w-4 h-4 text-white fill-gray-500" />}
              />
            )}
          />

          <Controller
            name="phone_number"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <FormInputAuth
                type="text"
                placeholder="Phone Number"
                value={value}
                onChange={onChange}
                error={errors.phone_number?.message}
                id="phone_number"
                name="phone_number"
                icon={<Phone className="w-4 h-4 text-white fill-gray-500" />}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormInputAuth
                type="password"
                placeholder="Password"
                value={value}
                onChange={onChange}
                error={errors.password?.message}
                id="password"
                name="password"
                is_password={true}
                icon={<KeyRound className="w-4 h-4 text-white fill-gray-500" />}
              />
            )}
          />

          <Controller
            name="confirm_password"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormInputAuth
                type="password"
                placeholder="Confirm Password"
                value={value}
                onChange={onChange}
                error={errors.confirm_password?.message}
                id="confirm_password"
                name="confirm_password"
                is_password={true}
                icon={<KeyRound className="w-4 h-4 text-white fill-gray-500" />}
              />
            )}
          />

          <div className="text-center mt-3">
            <Button
              width="w-full md:w-[80%]"
              bg="bg-primary"
              borderRadius="rounded"
              text="text-white font-base"
              padding="py-3"
              margin="mb-2"
              type="submit"
            >
              {emailPassowrdRegisterRequestProcessing ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Create an Account"
              )}
            </Button>
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
            className="w-full rounded-sm py-4 flex items-center justify-center gap-2 bg-gray-100 font-thin text-sm hover:bg-gray-50 shadow-md"
            onClick={() => register()}
          >
            {googleRegisterRequestProcessing ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <div className="flex items-center">
                <Image
                  src="/assets/google-icon.png"
                  alt="Google"
                  width={20}
                  height={20}
                  className="me-1"
                />
                <span>Sign up with Google</span>
              </div>
            )}
          </button>

        </div>
      </form>

      <p className="text-center mt-6 text-sm text-black font-thin mb-8">
        Already have an account?{" "}
        <button
          onClick={() => setActiveModal(ModalID.login)}
          className="text-blue-500 hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const googleRegisterRequestProcessing =
    state.loading.effects.authentication.googleSocialSignin;
  const emailPassowrdRegisterRequestProcessing =
    state.loading.effects.authentication.signIn;
  const { message, type } = state.alert;
  return {
    googleRegisterRequestProcessing,
    emailPassowrdRegisterRequestProcessing,
    message,
    type,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  registerUser: (payload: NewUserPayload) =>
    dispatch.authentication.register(payload),
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterModalContent);
