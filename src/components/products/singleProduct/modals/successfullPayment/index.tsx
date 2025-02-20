"use client";

import Image from "next/image";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { FC } from "react";

import { ModalID } from "@/domain/components";
import { KeyRound } from "lucide-react";
import Button from "@/components/shared/button";
import { useRouter } from "next/navigation";
import { generateUUID } from "@/utilities";

type PaymentSuccessfullModalContentProps = {
  setActiveModal: (modalId: ModalID) => void;
  clearCartAndCartSummary: () => void;
};

const PaymentSuccessfullModal: FC<PaymentSuccessfullModalContentProps> = ({
  setActiveModal,
  clearCartAndCartSummary,
}) => {
  const router = useRouter();
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mt-5 mb-5">
        <Image
          src="/assets/check.png"
          alt="Fullbooker Logo"
          width={130}
          height={40}
          className="mx-auto"
        />
        <div className="text-center items-center mt-8 mb-10 flex justify-center">
          <h2 className="text font-bold">Payment Received successfully</h2>
        </div>

        <div className="text-center items-center mb-2 flex justify-center">
          <p className="text-sm font-thin">Your purchase was successfull</p>
        </div>
      </div>

      <div className="text-center mt-20">
        <Button
          padding="py-2"
          margin="mt-4"
          borderRadius="rounded-md"
          text="text-black"
          bg="bg-primary"
          width="sm:w-full xs:w-full lg:w-[80%] md:w-[80%] w-full"
          onClick={() => {
            router.push(`/product/checkout/ticket/${generateUUID()}`);
            setActiveModal(ModalID.none);
          }}
        >
          See ticket details
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  clearCartAndCartSummary: () => dispatch.products.clearCartAndCartSummary(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentSuccessfullModal);
