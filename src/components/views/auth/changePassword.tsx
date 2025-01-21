"use client";

import { Switch } from "@/components/themeToggle/auth/switch";
import Image from "next/image";
import FormInputAuth from "../../../components/auth/FormInputAuth";
import ButtonAuth from "../../../components/auth/ButtonAuth";
import Card from "../../../components/auth/Card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/store";
import { ChangePasswordPayload, UserCredentials } from "@/domain/auth";
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
  identifierToBeVerified: string;
  resetPassword: (credentials: ChangePasswordPayload) => void;
};

const LoginModalContent: FC<LoginModalContentProps> = ({
  loading,
  resetPassword,
  identifierToBeVerified
}) => {
  const defaultValues = {
    identifier: identifierToBeVerified || "",
    password: "",
    confirm_password: "",
  };

  interface FormData {
    identifier: string;
    password: string;
    confirm_password: string;
  }
  
  const schema = yup.object().shape({
    identifier: yup.string().required("Identifier is required"),
    password: yup.string().required("Password is required"),
    confirm_password: yup
      .string()
      .required("Confirm your password")
      .oneOf([yup.ref('password')], "Passwords must match"),
  });

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
    const { identifier, password, confirm_password } = data;
    resetPassword({ identifier, password, confirm_password } as ChangePasswordPayload);
  };

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
        <h2 className="text-xl font-semibold mb-2">
          Please enter your new password below
        </h2>
      </div>

      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <FormInputAuth
                id="password"
                name="password"
                type="password"
                placeholder="New Password"
                onChange={onChange}
                value={value}
                error={errors?.password?.message}
              />
            )}
          />

          <Controller
            name="confirm_password"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <FormInputAuth
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Confirm Password"
                onChange={onChange}
                value={value}
                error={errors?.confirm_password?.message}
              />
            )}
          />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500 mt-4"
          >
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Save new Password"
            )}
          </button>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  const {identifierToBeVerified } = state.authentication;
  return { loading, identifierToBeVerified };
};

const mapDispatchToProps = (dispatch: any) => ({
  resetPassword: (credentials: ChangePasswordPayload) =>
    dispatch.authentication.resetPassword(credentials),
  getUserProfile: () => dispatch.profile.getUserProfile(),
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModalContent);
