import { mdiChevronRight } from '@mdi/js';
import Icon from '@mdi/react';
import { ButtonBaseProps, Popper, ClickAwayListener, Grow, Paper, MenuList } from '@mui/material';
import React, { ReactNode, useState } from 'react';
import { DropdownItem } from './dropdownitem';

interface DropdownSubmenuProps extends ButtonBaseProps {
    label?: ReactNode;
    hideArrow?: boolean;
}

const popperModifiers = [
    {
        name: 'flip',
        enabled: true,
    },
    {
        name: 'preventOverflow',
        enabled: true,
    },
    {
        name: 'offset',
        enabled: true,
        offset: '0, 8',
    },
];

export const DropdownSubmenu: React.FC<DropdownSubmenuProps> = ({ label, children, hideArrow, ...props }) => {
    const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
    const onOpen: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
        setAnchor(evt.currentTarget);
    };
    return (
        <>
            <DropdownItem data-testid='root' {...props} onClick={onOpen} endAdornment={<Icon path={mdiChevronRight} size={0.75} />}>
                {label}
            </DropdownItem>
            <Popper anchorEl={anchor} open={!!anchor} placement='right-start' disablePortal modifiers={popperModifiers} className='dropdown__menu' transition>
                {({ TransitionProps, ...props }) => (
                    <ClickAwayListener onClickAway={() => setAnchor(null)}>
                        <Grow {...TransitionProps} timeout={300}>
                            <Paper data-testid='submenu' className='styled__menu'>
                                <MenuList>{children}</MenuList>
                            </Paper>
                        </Grow>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};

/**
	jest.mock('../select/dropdown/dropdownsubmenu', () => {
		const originalModule = jest.requireActual('../select/dropdown/dropdownsubmenu');
		return {
			...originalModule,
			Dropdown: originalModule.DropdownTestComponent,
		};
	});
 */

export const DropdownSubmenuTestComponent: React.FC<DropdownSubmenuProps> = ({ label, children, ...props }) => {
    return <div {...(props as any)}>{children}</div>;
};
