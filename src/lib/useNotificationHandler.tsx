import { useEffect, useState } from "react";
import { connect } from "react-redux";
import toast from "react-hot-toast";
import { RootState } from "../../src/store";
import { NotificationType } from "../../src/domain/notification";
import Snackbar from "@mui/material/Snackbar";

interface NotificationProps {
  type: NotificationType | null;
  message: string | null;
}

interface DispatchProps {
  clearAlert: () => void;
}

const NotificationHandler = ({
  type,
  message,
  clearAlert,
}: NotificationProps & DispatchProps) => {
  let timer: NodeJS.Timeout | undefined;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (type) {
        const notify = () => {
          setOpen(true);
          // type === NotificationType.success ? toast(message) : toast(message);
          // eslint-disable-next-line react-hooks/exhaustive-deps
          timer = setTimeout(() => {
            setOpen(false);
            clearAlert();
          }, 5000);
        };
        notify();
      }
    } catch (err) {
      console.log("ERRR: ", err);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [type, message]);

  return (
    <div>
      {message && type && (
        <Snackbar
          ContentProps={{
            sx: {
              background: type === NotificationType.success ? "green" : "red",
            },
          }}
          open={open}
          autoHideDuration={6000}
          onClose={() => clearAlert()}
          message={message}
          // action={action}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { type, message } = state.alert;
  return { type, message };
};

const mapDispatchToProps = (dispatch: any) => ({
  clearAlert: () => dispatch.alert.clearAlert(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationHandler);
