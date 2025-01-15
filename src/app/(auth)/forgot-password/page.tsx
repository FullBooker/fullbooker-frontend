"use client";

import ButtonAuth from "@/components/auth/ButtonAuth";
import Card from "@/components/auth/Card";
import FormInputAuth from "@/components/auth/FormInputAuth";
import { Switch } from "@/components/themeToggle/auth/switch";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { RootState } from "@/store";
import { connect } from "react-redux";
import { FC, useEffect } from "react";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress } from "@mui/material";
import { NotificationType } from "@/domain/notification";
import { ForgotPasswordPayload } from "@/domain/dto/input";

type ForgotPasswordPageProps = {
  loading: boolean;
  forgotPassword: (payload: ForgotPasswordPayload) => void;
  message: string;
  type: NotificationType;
};

const defaultValues = {
  Phone: "",
};

interface FormData {
  Phone: string;
}

const schema = yup.object().shape({
  Phone: yup
    .string()
    .min(10, "Phone number must be atleast 10 digits")
    .required("Phone number is required"),
});

const ForgotPasswordPage: FC<ForgotPasswordPageProps> = ({
  loading,
  forgotPassword,
  message,
  type,
}) => {
  const router = useRouter();
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const { Phone } = data;
    forgotPassword({ Phone } as ForgotPasswordPayload);
  };

  useEffect(() => {
    if (
      type === NotificationType.success &&
      message?.includes("OTP code has been sent successfully")
    ) {
      router.push(`/reset-password?phone=${getValues("Phone")}`);
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
              <div data-hide-on-theme="dark">
                <Image
                  src="/assets/logo_light.png"
                  alt="MowinBet Logo"
                  width={238}
                  height={39.29}
                  className="w-[130px] h-[45px] sm:w-[150px] sm:h-[50px] md:w-[200px] md:h-[60px]"
                />
              </div>

              {/* When the theme is light, hide this div */}
              <div data-hide-on-theme="light">
                <Image
                  src="/assets/logo_dark.png"
                  alt="MowinBet Logo"
                  width={238}
                  height={39.29}
                  className="w-[130px] h-[45px] sm:w-[150px] sm:h-[50px] md:w-[200px] md:h-[60px]"
                />
              </div>
              <Switch />
            </div>
            <div className="flex-col sm:flex-row space-x-1">
              <span className="text-xs xl:text-sm text-textColor">
                Remember Your Password?
              </span>
              <Link
                href="/login"
                className="text-xs xl:text-sm text-mainColor underline underline-offset-2"
              >
                Login
              </Link>
            </div>
          </div>
          <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-2"
          >
            <Card>
              <div className="flex flex-col items-center text-center space-y-1.5">
                <h1 className="md:text-xl xl:text-2xl 2xl:text-2xl font-semibold">
                  Enter Your Phone Number
                </h1>
                <span className="text-xs xl:text-base font-normal text-textColor">
                  We will send OTP to your phone number
                </span>
              </div>
              <div className="flex flex-col w-full space-y-2">
                <div className="flex flex-col space-y-3 md:space-y-4 lg:space-y-6 xl:space-y-8">
                  <Controller
                    name="Phone"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <FormInputAuth
                        id="Phone"
                        name="Phone"
                        type="text"
                        placeholder="Your phone number"
                        onChange={onChange}
                        value={value}
                        error={errors?.Phone?.message}
                      >
                        Phone Number
                      </FormInputAuth>
                    )}
                  ></Controller>
                </div>
              </div>
              <div className="flex flex-col w-full">
                <ButtonAuth type="submit">
                  {loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    "Receive OTP"
                  )}
                </ButtonAuth>
              </div>
            </Card>
          </form>
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

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  const { message, type } = state.alert;
  return { loading, type, message };
};

const mapDispatchToProps = (dispatch: any) => ({
  forgotPassword: (payload: ForgotPasswordPayload) =>
    dispatch.authentication.forgotPassword(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordPage);
