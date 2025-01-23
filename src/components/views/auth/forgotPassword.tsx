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
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    requestOTP({
      identifier: (data.otp_method === "email" ? data.email : data.phone_number) as string,
      otp_method: data.otp_method,
    });
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
        <h2 className="text-xl font-semibold mb-2">Reset your password</h2>
      </div>

      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Controller
            name="otp_method"
            control={control}
            render={({ field: { value, onChange } }) => (
              <select
                className="w-full p-2 border rounded-md"
                value={value}
                onChange={onChange}
              >
                <option value="">Select OTP Delivery Option</option>
                <option value="email">Email</option>
                <option value="phone">Phone Number</option>
              </select>
            )}
          />

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
                />
              )}
            />
          )}

          <button
            type="submit"
            className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500"
          >
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 gap-1">
          Go back to{" "}
          <button
            onClick={() => setActiveModal(ModalID.login)}
            className="text-blue-500 hover:text-blue-600"
          >
            Login
          </button>
        </p>
      </div>
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
