import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { ModalID } from "@/domain/components";
import { RootState } from "@/store";
  import React, { FC } from "react";
import { connect } from "react-redux";
import { X } from "lucide-react";

  type UniversalModalProps = {
    theme?: string | undefined;
    title: string;
    description: string;
    type: "Deposit" | "Withdraw";
    amount: string;
    buttonTitle?: string;
    open?: boolean;
    setActiveModal: (modalId: ModalID) => void;
    content: any;
    fullScreen?: boolean;
  }
  
  const UniversalModal: FC<UniversalModalProps> = ({
    theme,
    title,
    description,
    open = true,
    content,
    setActiveModal,
    fullScreen = false
  }) => {
    return (
      <Dialog open={open}>
        <DialogContent className={`w-[320px] xs:w-[450px] md:w-[530px] flex flex-col justify-center items-center pt-4 sm:rounded-2xl md:rounded-3xl ${fullScreen ? 'w-full h-full' : 'rounded-xl'} max-h-[100vh] overflow-y-auto`}>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" onClick={() => setActiveModal(ModalID.none)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader className="flex flex-col justify-center items-center gap-1 lg:gap-4">
            <DialogTitle className="text-lg md:text-xl lg:text-2xl text-center">
              {title}
            </DialogTitle>
            <DialogDescription
              className={`text-xs md:text-sm text-center ${
                theme === "light" ? "text-textColor2" : "text-textColor"
              }`}
            >
              <span className="leading-relaxed">{description}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col w-full sm:pr-0 sm:pl-0 xs:pr-0 xs:pl-0">
            {content}
          </div>

          <DialogFooter className="w-full mt-2 md:mt-6">
           
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  const mapStateToProps = (state: RootState) => {
    const loading = state.loading.models.authentication;
    const { profile, showBalance } = state.profile;
    const { isLoggedIn, authData } = state.authentication;
    return { isLoggedIn, authData, loading, profile, showBalance };
  };
  
  const mapDispatchToProps = (dispatch: any) => ({
    setActiveModal: (modalId: ModalID) => dispatch.components.setActiveModal(modalId),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(UniversalModal);
  
  