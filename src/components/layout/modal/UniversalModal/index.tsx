import React, { FC } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { ModalID } from "@/domain/components";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { X } from "lucide-react";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { DeviceType } from "@/domain/constants";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

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
  showDividers?: boolean;
  footer?: any;
};

const UniversalModal: FC<UniversalModalProps> = ({
  theme,
  title,
  description,
  open = true,
  content,
  setActiveModal,
  fullScreen = false,
  showDividers = false,
  footer,
}) => {
  const handleclose = () => {
    setActiveModal(ModalID.none);
  };
  const device = useDeviceType();
  return (
    <Dialog
      open={open}
      onClose={() => handleclose}
      scroll={"paper"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth={false}
      PaperProps={{
        style: {
          width:
            device === DeviceType.mobile
              ? "90vw"
              : device === DeviceType.tablet
              ? "60vw"
              : "30vw",
          maxWidth: "1200px",
          minHeight: "40vh",
          borderRadius: "10px",
        },
      }}
      sx={{
        "& .MuiPaper-root": {
          maxWidth: "1200px",
          width:
            device === DeviceType.mobile
              ? "90vw"
              : device === DeviceType.tablet
              ? "60vw"
              : "30vw",
          "@media (max-width: 600px)": {
            width:
              device === DeviceType.mobile
                ? "90vw"
                : device === DeviceType.tablet
                ? "60vw"
                : "30vw",
            minHeight: "40vh",
            maxWidth: "100%",
            margin: 0,
            borderRadius: 0,
          },
        },
      }}
    >
      <DialogTitle id="scroll-dialog-title">
        <div className="flex justify-between items-center">
          <div></div>
          <div className="items-center">
            <p className="text-black font-semibold text-lg"> {title}</p>
          </div>
          <div
            className="flex justify-start cursor-pointer"
            onClick={() => handleclose()}
          >
            <X className="h-4 w-4" />
          </div>
        </div>
      </DialogTitle>
      <DialogContent dividers={showDividers} sx={{ backgroundColor: "white" }}>
        <div>{content}</div>
      </DialogContent>
      {footer && (
        <DialogActions sx={{ justifyContent: "space-between" }}>
          {footer}
        </DialogActions>
      )}
    </Dialog>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  const { profile } = state.profile;
  const { isLoggedIn, authData } = state.authentication;
  return { isLoggedIn, authData, loading, profile };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
});

export default connect(mapStateToProps, mapDispatchToProps)(UniversalModal);
