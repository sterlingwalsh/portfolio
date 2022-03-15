import { mdiInformationOutline, mdiAlertOutline, mdiCheckboxMarkedCircleOutline } from '@mdi/js';
// General Color names. maps to css classes
export type ColorOptions = 'inherit' | 'action' | 'warning' | 'danger' | 'secondary' | 'dark' | 'tertiary' | 'light-purple' | 'white';
// Base message types used on app wide messages as well as dashboard widget components
export type AlertVariant = 'info' | 'danger' | 'success' | 'loading' | 'warning';
export const messageIcons = {
    info: mdiInformationOutline,
    danger: mdiAlertOutline,
    warning: mdiAlertOutline,
    success: mdiCheckboxMarkedCircleOutline,
};
