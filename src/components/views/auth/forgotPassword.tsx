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
};

interface FormData {
  email: string;
}

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPasswordModalContent: FC<ForgotPasswordModalContentProps> = ({
  loading,
  requestOTP,
  setActiveModal
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    requestOTP({identifier: data?.email});
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
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <FormInputAuth
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                icon="mail"
                onChange={onChange}
                value={value}
                error={errors?.email?.message}
              />
            )}
          />

          <button
            type="submit"
            className="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500"
          >
            {loading ? <CircularProgress size={18} color="inherit" /> : "Continue"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 gap-1">
          Go back to {" "}
          <button onClick={() => setActiveModal(ModalID.login)} className="text-blue-500 hover:text-blue-600">
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
  setActiveModal: (modalId: ModalID) => dispatch.components.setActiveModal(modalId),
  requestOTP: (payload: RequestOTPPayload) => dispatch.authentication.requestOTP(payload)
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordModalContent); 