import { MenuItemProps, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { ReactNode } from 'react';

export interface DropdownItemProps extends MenuItemProps<'button'> {
    icon?: ReactNode;
    endAdornment?: ReactNode;
}
export const DropdownItem: React.FC<DropdownItemProps> = ({ children, icon, endAdornment, ...props }) => (
    <MenuItem data-testid='dropdown-item' {...props} className={`dropdown__menu${props.className ? ` ${props.className}` : ''}`} component='button'>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText>
            <div className='dropdown__menu__item__content'>{children}</div>
        </ListItemText>
        {endAdornment}
    </MenuItem>
);
