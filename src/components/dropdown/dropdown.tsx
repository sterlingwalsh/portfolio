import { mdiChevronDown } from '@mdi/js';
import Icon from '@mdi/react';
import { ButtonBaseProps, PopperPlacementType, ButtonBase, Popper, ClickAwayListener, Grow, Paper, MenuList } from '@mui/material';
import React, { useState, ReactNode } from 'react';

/**
 * options: Array of options matching the Option data type
 * helptext: InfoProps data to display a popup when requested
 */

interface DropdownProps extends ButtonBaseProps<'div'> {
    label?: ReactNode;
    variant?: 'button' | 'icon';
    hideArrow?: boolean;
    hideUnderline?: boolean;
    placement?: PopperPlacementType;
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
];

export const Dropdown: React.FC<DropdownProps> = ({ variant, label, children, className, hideArrow, hideUnderline, ...props }) => {
    hideArrow = hideArrow === undefined ? variant === 'icon' : hideArrow;
    hideUnderline = hideUnderline === undefined ? variant === 'icon' : hideUnderline;
    const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
    const onOpen: React.MouseEventHandler<HTMLDivElement> = (evt) => {
        setAnchor(evt.currentTarget);
    };
    return (
        <>
            <ButtonBase
                component='div'
                data-testid='root'
                className={`dropdown ${variant === 'icon' ? ' dropdown__icon' : ''}${!hideUnderline ? ' hover__underline' : ''}${className ? ` ${className}` : ''}`}
                onClick={onOpen}
            >
                <div data-testid='trigger' className={`${!hideUnderline ? 'hover__underline__target' : ''} dropdown__container`}>
                    <div>{label}</div>
                    {!hideArrow && <Icon path={mdiChevronDown} size={0.75} color='currentColor' rotate={anchor ? 180 : 360} className='dropdown__help_icon' />}
                </div>
            </ButtonBase>
            <Popper anchorEl={anchor} open={!!anchor} placement='bottom-start' modifiers={popperModifiers} {...props} className='dropdown__menu' transition>
                {({ TransitionProps, ...props }) => (
                    <ClickAwayListener onClickAway={() => setAnchor(null)}>
                        <Grow {...TransitionProps} timeout={300}>
                            <Paper className='styled__menu'>
                                <MenuList disablePadding>{children}</MenuList>
                            </Paper>
                        </Grow>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};
