import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast();

// Typen für die Toast-Parameter
type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastPosition = 'top' | 'bottom' | 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';

// Allgemeine Toast-Funktion
export const showToast = (type: ToastType, message: string, position: ToastPosition = 'top-right', duration: number = 3000): void => {
    toast[type](message, { position, duration });
};

// Spezifische Methoden für gängige Toast-Typen
export const showSuccess = (message: string, position: ToastPosition = 'top-right', duration: number = 3000): void => {
    showToast('success', message, position, duration);
};

export const showError = (message: string, position: ToastPosition = 'top-right', duration: number = 3000): void => {
    showToast('error', message, position, duration);
};

export const showInfo = (message: string, position: ToastPosition = 'top-right', duration: number = 3000): void => {
    showToast('info', message, position, duration);
};

export const showWarning = (message: string, position: ToastPosition = 'top-right', duration: number = 3000): void => {
    showToast('warning', message, position, duration);
};
