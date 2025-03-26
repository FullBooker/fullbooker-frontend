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
import Button from "@/components/shared/button";
import Link from "next/link";

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
          width={deviceType === DeviceType.mobile ? 150 : 200}
          height={deviceType === DeviceType.mobile ? 150 : 200}
          className="mx-auto"
        />
        <div className="text-center items-center mt-3 mb-3 flex justify-center">
          <h2 className="text-lg font-medium">Almost there</h2>
        </div>
        <div className="mb-3">
          <p className="text-sm">
            Your product has been submitted for review. It will appear as 'Under
            Review' in your product list and should be live within 24hrs,
            pending verification by our Fullbooker team.
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <Button
          width="w-full md:w-[70%]"
          bg="bg-primary"
          borderRadius="rounded"
          text="text-white"
          padding="py-2"
          margin="mb-2"
          type="button"
          onClick={() => {
            router.push("/vendor/products");
            setActiveModal(ModalID.none);
          }}
        >
          {loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            "Continue to your Products"
          )}
        </Button>
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
