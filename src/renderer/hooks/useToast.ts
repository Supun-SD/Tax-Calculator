import { toast, Bounce, ToastOptions } from 'react-toastify';

interface UseToastReturn {
  showSuccess: (message: string, options?: Partial<ToastOptions>) => void;
  showError: (message: string, options?: Partial<ToastOptions>) => void;
  showInfo: (message: string, options?: Partial<ToastOptions>) => void;
  showWarning: (message: string, options?: Partial<ToastOptions>) => void;
}

const defaultOptions: ToastOptions = {
  position: 'bottom-right',
  pauseOnHover: false,
  autoClose: 4000,
  theme: 'colored',
  transition: Bounce,
  draggable: true,
  style: {
    zIndex: 9999,
    width: '100%',
  },
  containerId: 'toast-container',
};

export const useToast = (): UseToastReturn => {
  const showSuccess = (message: string, options?: Partial<ToastOptions>) => {
    toast.success(message, {
      ...defaultOptions,
      ...options,
    });
  };

  const showError = (message: string, options?: Partial<ToastOptions>) => {
    toast.error(message, {
      ...defaultOptions,
      ...options,
    });
  };

  const showInfo = (message: string, options?: Partial<ToastOptions>) => {
    toast.info(message, {
      ...defaultOptions,
      ...options,
    });
  };

  const showWarning = (message: string, options?: Partial<ToastOptions>) => {
    toast.warning(message, {
      ...defaultOptions,
      ...options,
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
