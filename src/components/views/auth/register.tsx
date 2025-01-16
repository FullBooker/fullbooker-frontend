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
import { User, Lock, Mail } from "lucide-react";
import { Facebook } from "lucide-react";
import { Chrome } from "lucide-react";
import { ModalID } from "@/domain/components";

type RegisterModalContentProps = {
  loading: boolean;
  registerUser: (payload: NewUserPayload) => void;
  type: NotificationType;
  message: string;
  setActiveModal: (modalId: ModalID) => void;
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

const RegisterModalContent: FC<RegisterModalContentProps> = ({
  loading,
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
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <Image
          src="/assets/logo.svg"
          alt="Fullbooker Logo"
          width={200}
          height={40}
          className="mx-auto mb-6"
        />
        <h1 className="text-2xl font-semibold mb-2">Create an account</h1>
      </div>

      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Controller
            name="phone"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <FormInputAuth
                type="text"
                placeholder="Email Address"
                value={value}
                onChange={onChange}
                error={errors.phone?.message}
                helperText={errors?.phone?.message}
                startIcon={<User className="w-5 h-5 text-gray-400" />}
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
                helperText={errors?.password?.message}
                startIcon={<Lock className="w-5 h-5 text-gray-400" />}
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
                helperText={errors?.confirm_password?.message}
                startIcon={<Lock className="w-5 h-5 text-gray-400" />}
              />
            )}
          />

          <button
            type="submit"
            className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500"
          >
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Create an Account"
            )}
          </button>

          <div className="relative py-3 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-600">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            type="button"
            className="w-full border rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <Image
              src="/assets/google-icon.png"
              alt="Google"
              width={20}
              height={20}
            />
            Log in with Google
          </button>

          <button
            type="button"
            className="w-full border rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <Image
              src="/assets/facebook-icon.png"
              alt="Facebook"
              width={20}
              height={20}
            />
            Log in with Facebook
          </button>
        </div>
      </form>

      <p className="text-center mt-6">
        Already have an account?{" "}
        <button
          onClick={() => setActiveModal(ModalID.login)}
          className="text-orange-500 hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  const { message, type } = state.alert;
  return { loading, message, type };
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
