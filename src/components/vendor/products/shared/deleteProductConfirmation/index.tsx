"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { RootState } from "@/store";
import { connect } from "react-redux";

import { ModalID } from "@/domain/components";
import { KeyRound } from "lucide-react";
import { ViewType } from "@/domain/constants";
import { NewProductPayload } from "@/domain/dto/input";
import { CircularProgress } from "@mui/material";

type ProductDeletionConfirmationModalContentProps = {
  setActiveModal: (modalId: ModalID) => void;
  deleteProduct: (productId: string) => void;
  newProduct: NewProductPayload;
  loading: boolean;
};

const ProductDeletionConfirmationModal: FC<
  ProductDeletionConfirmationModalContentProps
> = ({
  setActiveModal,
  deleteProduct,
  newProduct,
  loading
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center">
        <Image
          src="/assets/delete.jpg"
          alt="Fullbooker Logo"
          width={isMobile ? 250 : 400}
          height={isMobile ? 250 : 400}
          className="mx-auto"
        />
        <div className="text-center items-center mb-2 flex justify-center">
          <h2 className="text font-bold">
            Are you sure you want to delete this product?
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
            deleteProduct(newProduct?.id as string);
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
  deleteProduct: (productId: string) =>
    dispatch.vendor.deleteProduct(productId),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDeletionConfirmationModal);
