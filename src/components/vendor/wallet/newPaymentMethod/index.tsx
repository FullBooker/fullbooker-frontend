"use client";

import { FC } from "react";
import { connect } from "react-redux";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RootState } from "@/store";
import Button from "@/components/shared/button";
import { NewPaymentMethodPayload } from "@/domain/dto/input/vendor.input";
import { PaymentMethod } from "@/constants";
import FormInputAuth from "../../../auth/FormInputAuth";
import CircularProgress from "@mui/material/CircularProgress";

const paymentSchema = yup.object().shape({
  type: yup.string().required("Payment method is required"),
  bank_details: yup
    .object()
    .shape({
      bank_name: yup.string().required("Bank name is required"),
      bank_code: yup.string().required("Bank code is required"),
      branch: yup.string().required("Branch is required"),
      account_number: yup.string().required("Account number is required"),
    })
    .nullable()
    .default(undefined)
    .when("type", {
      is: PaymentMethod.BANK,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired().default(undefined),
    }),
  mobile_money_details: yup
    .object()
    .shape({
      mobile_money_type: yup.string().required("Mobile money type is required"),
      business_number: yup.string().required("Business number is required"),
    })
    .nullable()
    .default(undefined)
    .when("type", {
      is: PaymentMethod.MPESA,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired().default(undefined),
    }),
});

const defaultValues: NewPaymentMethodPayload = {
  type: "" as PaymentMethod,
  bank_details: undefined,
  mobile_money_details: undefined,
};

interface NewPaymentMethodFormProps {
  processing: boolean;
  addPaymentMethod: (payload: NewPaymentMethodPayload) => void;
}

const NewPaymentMethodForm: FC<NewPaymentMethodFormProps> = ({
  processing,
  addPaymentMethod,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewPaymentMethodPayload>({
    defaultValues,
    resolver: yupResolver(paymentSchema) as Resolver<NewPaymentMethodPayload>,
  });

  const selectedType = watch("type");

  const onSubmit = (data: NewPaymentMethodPayload) => {
    addPaymentMethod(
      data?.type === PaymentMethod.MPESA
        ? { ...data, bank_details: undefined }
        : { ...data, mobile_money_details: undefined }
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-center text-lg font-semibold mb-4">
        Add Payment Method
      </h2>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <select {...field} className="w-full border p-2 rounded">
                <option value="">Select Payment Method</option>
                <option value={PaymentMethod.BANK}>Bank</option>
                <option value={PaymentMethod.MPESA}>Mpesa</option>
              </select>
            )}
          />
          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}

          {selectedType === PaymentMethod.BANK && (
            <>
              <Controller
                name="bank_details.bank_name"
                control={control}
                render={({ field }) => (
                  <FormInputAuth
                    {...field}
                    id="bank_name"
                    name="bank_name"
                    type="text"
                    placeholder="Bank Name"
                    error={errors.bank_details?.bank_name?.message}
                  />
                )}
              />
              <Controller
                name="bank_details.bank_code"
                control={control}
                render={({ field }) => (
                  <FormInputAuth
                    {...field}
                    id="bank_code"
                    name="bank_code"
                    type="text"
                    placeholder="Bank Code"
                    error={errors.bank_details?.bank_code?.message}
                  />
                )}
              />
              <Controller
                name="bank_details.branch"
                control={control}
                render={({ field }) => (
                  <FormInputAuth
                    {...field}
                    id="branch"
                    name="branch"
                    type="text"
                    placeholder="Branch"
                    error={errors.bank_details?.branch?.message}
                  />
                )}
              />
              <Controller
                name="bank_details.account_number"
                control={control}
                render={({ field }) => (
                  <FormInputAuth
                    {...field}
                    id="account_number"
                    name="account_number"
                    type="text"
                    placeholder="Account Number"
                    error={errors.bank_details?.account_number?.message}
                  />
                )}
              />
            </>
          )}

          {selectedType === PaymentMethod.MPESA && (
            <>
              <Controller
                name="mobile_money_details.mobile_money_type"
                control={control}
                render={({ field }) => (
                  <FormInputAuth
                    {...field}
                    id="mobile_money_type"
                    name="mobile_money_type"
                    type="text"
                    placeholder="Mobile Money Type"
                    error={
                      errors.mobile_money_details?.mobile_money_type?.message
                    }
                  />
                )}
              />
              <Controller
                name="mobile_money_details.business_number"
                control={control}
                render={({ field }) => (
                  <FormInputAuth
                    {...field}
                    id="business_number"
                    name="business_number"
                    type="text"
                    placeholder="Business Number"
                    error={
                      errors.mobile_money_details?.business_number?.message
                    }
                  />
                )}
              />
            </>
          )}

          <Button
            type="submit"
            width="w-full"
            bg="bg-primary"
            borderRadius="rounded"
            text="text-white"
            padding="py-2"
          >
            {processing ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  processing: state.loading.effects.vendor.addPaymentMethod,
});

const mapDispatchToProps = (dispatch: any) => ({
  addPaymentMethod: (payload: NewPaymentMethodPayload) =>
    dispatch.vendor.addPaymentMethod(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPaymentMethodForm);
