import { useState, useEffect } from "react";

const useOtpTimer = () => {
  const [timer, setTimer] = useState(120); // Initial timer value: 5 minutes
  const [timerDisplay, setTimerDisplay] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    let countdown: NodeJS.Timeout;

    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(countdown);
            setIsResendDisabled(false); // Enable the button when timer reaches 0
            return 0;
          }
        });
      }, 1000);
    } else {
      setIsResendDisabled(false); // Enable the button when timer is already 0
    }

    return () => clearInterval(countdown);
  }, [timer]);

  useEffect(() => {
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${
        remainingSeconds < 10 ? "0" : ""
      }${remainingSeconds}`;
    };

    setTimerDisplay(formatTime(timer));
  }, [timer]);

  const handleResendClick = () => {
    setTimer(120); // Reset the timer to 5 minutes
    setIsResendDisabled(true); // Disable the button again
  };

  return {
    timerDisplay,
    isResendDisabled,
    handleResendClick,
  };
};

export default useOtpTimer;
