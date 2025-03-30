"use client";

import { FC } from "react";
import Image from "next/image";
import { connect } from "react-redux";
import { RootState } from "@/store";
import FormInputAuth from "../../../components/auth/FormInputAuth";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress } from "@mui/material";
import { ModalID } from "@/domain/components";
import { RequestOTPPayload } from "@/domain/dto/input";
import { ArrowRight, ChevronRight, Mail, Phone } from "lucide-react";
import Button from "@/components/shared/button";

type ForgotPasswordModalContentProps = {
  loading: boolean;
  requestOTP: (payload: RequestOTPPayload) => void;
  setActiveModal: (modalId: ModalID) => void;
};

const defaultValues = {
  email: "",
  phone_number: "",
  otp_method: "email",
};

interface FormData {
  email?: string;
  phone_number?: string;
  otp_method: any;
}

const schema = yup.object().shape({
  email: yup.string().when("otp_method", {
    is: "email",
    then: (schema) =>
      schema.email("Invalid email").required("Email is required"),
    otherwise: (schema) => schema,
  }),
  phone_number: yup.string().when("otp_method", {
    is: "phone",
    then: (schema) => schema.min(10).required("Phone number is required"),
    otherwise: (schema) => schema,
  }),
  otp_method: yup.string().oneOf(["email", "phone"]).required(),
});

const ForgotPasswordModalContent: FC<ForgotPasswordModalContentProps> = ({
  loading,
  requestOTP,
  setActiveModal,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    requestOTP({
      identifier: (data.otp_method === "email"
        ? data.email
        : data.phone_number) as string,
      otp_method: data.otp_method,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <Image
          src="/assets/logo.svg"
          alt="Fullbooker Logo"
          width={200}
          height={40}
          className="mx-auto"
        />
        <div className="text-center items-center mb-2 flex justify-center">
          <h2 className="text-sm font-semibold border-b-2 border-darkOrange">
            Reset your password
          </h2>
        </div>
      </div>

      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {watch("otp_method") === "email" && (
            <Controller
              name="email"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormInputAuth
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={onChange}
                  value={value}
                  error={errors?.email?.message}
                  icon={<Mail className="w-4 h-4 text-white fill-gray-500" />}
                />
              )}
            />
          )}

          {watch("otp_method") === "phone" && (
            <Controller
              name="phone_number"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormInputAuth
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="Phone Number"
                  onChange={onChange}
                  value={value}
                  error={errors?.phone_number?.message}
                  icon={<Phone className="w-4 h-4 text-white fill-gray-500" />}
                />
              )}
            />
          )}

          <div
            className="text-center flex justify-center items-center cursor-pointer underline text-blue-500"
            onClick={() =>
              setValue(
                "otp_method",
                watch("otp_method") === "phone" ? "email" : "phone"
              )
            }
          >
            <p className="font-thin text-sm">
              Use {""}
              {watch("otp_method") === "phone"
                ? "email address"
                : "phone number"}{" "}
              instead?
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <Button
            width="w-full"
            bg="bg-primary"
            borderRadius="rounded"
            text="text-white font-base"
            padding="py-3"
            margin="mb-2"
            type="submit"
          >
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Continue"
            )}
          </Button>
          <p className="text-sm text-black gap-1 font-thin">
            Go back to{" "}
            <button
              onClick={() => setActiveModal(ModalID.login)}
              className="text-blue-500 hover:text-blue-600"
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  loading: state.loading.models.authentication,
});

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  requestOTP: (payload: RequestOTPPayload) =>
    dispatch.authentication.requestOTP(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordModalContent);
