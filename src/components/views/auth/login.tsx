"use client";

import Image from "next/image";
import FormInputAuth from "../../../components/auth/FormInputAuth";
import { RootState } from "@/store";
import { UserCredentials } from "@/domain/auth";
import { connect } from "react-redux";
import { FC } from "react";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress } from "@mui/material";
import { ModalID } from "@/domain/components";
import { KeyRound, Mail, Phone } from "lucide-react";
import { NotificationType } from "@/domain/notification";
import { useGoogleLogin } from "@/lib/hooks/useGoogleAuth";
import Button from "@/components/shared/button";
import { CustomAlert } from "@/components/shared/customAlert";

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
  sessionExpired?: boolean;
};

const defaultValues = {
  email: "",
  password: "",
};

export interface FormData {
  email: string;
  password: string;
}

export const schema = yup.object().shape({
  email: yup
    .string()
    .email("Provide a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginModalContent: FC<LoginModalContentProps> = ({
  emailPassowrdLoginRequestProcessing,
  signIn,
  setActiveModal,
  googleLoginRequestProcessing,
  sessionExpired = false,
}) => {
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
    const { email, password } = data;
    signIn({ email, password } as UserCredentials);
  };
  const { login } = useGoogleLogin();

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
        {sessionExpired && (
          <div className="mb-6">
            <CustomAlert
              variant="destructive"
              description="Your session has expired. Please sign in again to continue."
              dismissible
              className="bg-red-50 rounded-md border-none text-red-600"
            />
          </div>
        )}

        <div className="space-y-4">
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <FormInputAuth
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={onChange}
                value={value}
                icon={<Mail className="w-4 h-4 text-white fill-gray-500" />}
                error={errors?.email?.message}
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
            <Button
              width="w-full"
              bg="bg-primary"
              borderRadius="rounded"
              text="text-white font-base"
              padding="py-3"
              margin="mb-2"
              type="submit"
            >
              {emailPassowrdLoginRequestProcessing ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Sign In"
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
            onClick={() => login()}
          >
            {googleLoginRequestProcessing ? (
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
                <span>Sign in with Google</span>
              </div>
            )}
          </button>
        </div>
      </form>

      {!sessionExpired && (
        <div className="mt-10 text-center relative bottom-0 mb-8">
          <p className="text-sm text-black font-thin mb-4">
            <span>Don't have an account?</span>
          </p>
          <Button
            width="w-full"
            bg="bg-primary"
            borderRadius="rounded"
            text="text-white font-base"
            padding="py-3"
            margin="mb-2"
            onClick={() => setActiveModal(ModalID.register)}
          >
            Create an account
          </Button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const googleLoginRequestProcessing =
    state.loading.effects.authentication.googleSocialSignin;
  const emailPassowrdLoginRequestProcessing =
    state.loading.effects.authentication.signIn;
  const { isLoggedIn, authData } = state.authentication;
  const { message, type } = state.alert;
  return {
    emailPassowrdLoginRequestProcessing,
    isLoggedIn,
    message,
    authData,
    type,
    googleLoginRequestProcessing,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  signIn: (credentials: UserCredentials) =>
    dispatch.authentication.signIn(credentials),
  getUserProfile: () => dispatch.profile.getUserProfile(),
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModalContent);
