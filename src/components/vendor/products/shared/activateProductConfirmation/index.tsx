"use client";

import { FC } from "react";
import Image from "next/image";
import { RootState } from "@/store";
import { connect } from "react-redux";

import { ModalID } from "@/domain/components";
import { ActivateProductPayload, NewProductPayload } from "@/domain/dto/input";
import { CircularProgress } from "@mui/material";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { useRouter } from "next/navigation";
import { DeviceType } from "@/domain/constants";

type ActivatingProductConfirmationModalContentProps = {
  setActiveModal: (modalId: ModalID) => void;
  activateProduct: (payload: ActivateProductPayload) => Promise<void>;
  newProduct: NewProductPayload;
  loading: boolean;
};

const ActivatingProductConfirmationModal: FC<
  ActivatingProductConfirmationModalContentProps
> = ({ setActiveModal, activateProduct, newProduct, loading }) => {
  const deviceType = useDeviceType();
  const router = useRouter();

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center">
        <Image
          src="/assets/happy.jpg"
          alt="Fullbooker Logo"
          width={deviceType === DeviceType.mobile ? 250 : 400}
          height={deviceType === DeviceType.mobile ? 250 : 400}
          className="mx-auto"
        />
        <div className="text-center items-center mb-2 flex justify-center">
          <h2 className="text font-bold">
            Are you sure you want to activate this product?
          </h2>
        </div>
      </div>
      <div className="flex justify-between mt-4 gap-4">
        <button
          className="sm:w-full xs:w-full lg:w-[80%] md:w-[80%] w-full bg-primary text-black py-2 rounded-md"
          onClick={() => {
            setActiveModal(ModalID.none);
          }}
        >
          Cancel
        </button>
        <button
          className="sm:w-full xs:w-full lg:w-[80%] md:w-[80%] w-full bg-primary text-black py-2 rounded-md"
          onClick={() => {
            activateProduct({
              product: newProduct?.id as string,
              active: true,
            }).then(() => {
              router.push("/vendor/products");
            });
          }}
        >
          {loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.vendor;
  const { newProduct } = state.vendor;
  return {
    newProduct,
    loading,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  activateProduct: async (payload: ActivateProductPayload) =>
    dispatch.vendor.activateProduct(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivatingProductConfirmationModal);
