import Swal from 'sweetalert2';

export type AdminAlertOptions = {
  title?: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  timer?: number; // ms
  position?: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end';
};

export function showAdminAlert({ title, text, icon = 'info', timer = 3000, position = 'top-end' }: AdminAlertOptions) {
  // Use toast-style alerts so they auto-dismiss and don't block the UI.
  Swal.fire({
    toast: true,
    position,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    icon,
    title,
    text,
    customClass: {
      popup: 'shadow-lg border',
    },
  });
}

export default showAdminAlert;
