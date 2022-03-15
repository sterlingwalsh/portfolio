import { ButtonProps, Tooltip, Button, CircularProgress } from '@mui/material';
import React, { ReactNode, useRef } from 'react';
import { killEvt } from '../../helpers/utils';
import { ColorOptions } from '../../types/components.types';

/**
 * wrapperprops apply styles to div wrapper
 * title is the text of a tooltip
 * color applies predefined color profiles to the button
 * active toggles contained vs outlined to provide the effect of a toggleable button
 * stopClick prevents propagation of click events past this button
 * stopMouseDown prevents propagation of mouseDown events past this button. this is particularly useful when this button lives inside a buttonBase component.
 */
export interface StyledButtonProps extends Omit<ButtonProps, 'color' | 'title'> {
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    title?: ReactNode;
    color?: ColorOptions | 'override';
    active?: boolean;
    stopClick?: boolean;
    stopMouseDown?: boolean;
    slim?: boolean;
    wrapperClass?: string;
    stretch?: boolean;
    wrapperTestId?: string;
    loading?: boolean;
    tooltipPlacement?: 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top';
}

export const StyledButton: React.FC<StyledButtonProps> = ({
    wrapperProps,
    title,
    disabled,
    color = 'inherit',
    active,
    stopClick,
    stopMouseDown,
    onDoubleClick,
    onClick,
    slim,
    wrapperClass,
    stretch,
    wrapperTestId,
    loading,
    tooltipPlacement = 'top',
    ...props
}) => {
    const buttonState = useRef<{ count: number; timeout?: NodeJS.Timeout }>({ count: 0, timeout: undefined });
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
        if (stopClick) {
            killEvt(evt);
        }
        buttonState.current.count++;
        if (onDoubleClick) {
            const { count, timeout } = buttonState.current;
            if (count > 1) {
                timeout !== undefined && clearTimeout(timeout);
                onDoubleClick?.(evt);
                buttonState.current.count = 0;
            } else {
                buttonState.current.timeout = setTimeout(() => {
                    onClick?.(evt);

                    buttonState.current.count = 0;
                }, 250);
            }
        } else {
            onClick?.(evt);
        }
    };
    return (
        <Tooltip title={title ?? ''} placement={tooltipPlacement}>
            <div
                data-testid={wrapperTestId ?? 'styled-button-wrapper'}
                className={`button__wrapper${stretch || props.fullWidth ? ' fullwidth' : ''}${color !== 'inherit' ? ` button__${color}` : ''}${active ? ' button__active' : ''}${
                    wrapperClass ? ` ${wrapperClass}` : ''
                }`}
            >
                <Button
                    data-testid={'styled-button'}
                    {...props}
                    onMouseDown={
                        props.onMouseDown
                            ? (evt) => {
                                  stopMouseDown && killEvt(evt);
                                  props.onMouseDown!(evt);
                              }
                            : stopMouseDown
                            ? killEvt
                            : undefined
                    }
                    onClick={handleClick}
                    color='inherit'
                    variant={active === true ? 'contained' : active === false ? 'outlined' : props.variant}
                    className={`button__styled${props.className ? ` ${props.className}` : ''}${disabled || loading ? ' button__disabled' : ''}${slim ? ' button__slim' : ''}`}
                />
                {!!loading && (
                    <div className='button__spinner__wrapper'>
                        <CircularProgress data-testid='button__spinner' color='inherit' className='button__spinner' size='2rem' />
                    </div>
                )}
            </div>
        </Tooltip>
    );
};
