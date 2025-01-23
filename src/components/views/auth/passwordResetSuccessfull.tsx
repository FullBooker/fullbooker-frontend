"use client";

import Image from "next/image";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { FC} from "react";

import { ModalID } from "@/domain/components";
import { KeyRound } from "lucide-react";

type PasswordResetSuccessfullModalContentProps = {
  setActiveModal: (modalId: ModalID) => void;
};

const PasswordResetSuccessfullModal: FC<
  PasswordResetSuccessfullModalContentProps
> = ({ setActiveModal }) => {
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
          <h2 className="text font-bold">PASSWORD RESET SUCCESSFULLY</h2>
        </div>

        <div className="text-center items-center mb-2 flex justify-center">
          <p className="text-sm font-thin">
            You have reset your password successfully
          </p>
        </div>
      </div>

      <div className="text-center mt-20">
        <button
          className="sm:w-full xs:w-full lg:w-[80%] md:w-[80%] bg-primary  text-white py-2 rounded-md hover:opacity-3"
          onClick={() => setActiveModal(ModalID.login)}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordResetSuccessfullModal);
