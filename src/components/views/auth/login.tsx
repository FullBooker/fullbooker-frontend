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

type LoginModalContentProps = {
  loading: boolean;
  isLoggedIn: boolean;
  signIn: (payload: UserCredentials) => void;
  message: string;
  authData: any;
  getUserProfile: () => void;
  setActiveModal: (modalId: ModalID) => void;
};

const defaultValues = {
  phone_number: "",
  password: "",
};

interface FormData {
  phone_number: string;
  password: string;
}

const schema = yup.object().shape({
  phone_number: yup
    .string()
    .min(10, "Phone number must be atleast 10 digits")
    .required("Phone number is required"),
  password: yup.string().required("Password is required"),
});

const LoginModalContent: FC<LoginModalContentProps> = ({
  loading,
  isLoggedIn,
  signIn,
  message,
  authData,
  getUserProfile,
  setActiveModal,
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

  useEffect(() => {
    if (getToken()) {
      getUserProfile();
      const redirectUrl = searchParams.get("redirect");
      redirectUrl ? router.push(`/${redirectUrl}`) : router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, authData]);

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
        <h2 className="text-xl font-semibold mb-2">Log in to your account</h2>
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
                icon="user"
                onChange={onChange}
                value={value}
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
                icon="lock"
                onChange={onChange}
                value={value}
                error={errors?.password?.message}
              />
            )}
          />

          <div className="text-right">
            <button onClick={() => setActiveModal(ModalID.forgotPassword)} className="text-sm text-blue-500">
              Forgot password? Reset here
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500"
          >
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Sign In"
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full border rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <Image src="/assets/google-icon.png" alt="Google" width={20} height={20} />
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

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => setActiveModal(ModalID.register)}
            className="text-orange-400 hover:text-orange-500"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

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
  setActiveModal: (modalId: ModalID) => dispatch.components.setActiveModal(modalId)
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModalContent);
