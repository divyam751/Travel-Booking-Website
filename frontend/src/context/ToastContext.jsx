import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create the ToastContext
export const ToastContext = createContext();

// ToastProvider component
export const ToastProvider = ({ children }) => {
  const [toastOptions, setToastOptions] = useState({
    type: null,
    message: "",
    trigger: false, // Ensures the toast triggers only when explicitly set.
  });

  // showToast function to trigger toasts
  const showToast = useCallback(({ type, message }) => {
    setToastOptions({ type, message, trigger: true });
  }, []);

  // useEffect to display toast when the trigger is set to true
  useEffect(() => {
    if (toastOptions.trigger) {
      // Show a success toast
      if (toastOptions.type === "success") {
        toast.success(toastOptions.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
      // Show an error toast
      else if (toastOptions.type === "error") {
        toast.error(toastOptions.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
      //   Show info toast
      else if (toastOptions.type === "info") {
        toast.info(toastOptions.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }

      // Reset trigger to prevent repetitive toasts.
      setToastOptions((prev) => ({ ...prev, trigger: false }));
    }
  }, [toastOptions]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer style={{ marginTop: "50px" }} />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
