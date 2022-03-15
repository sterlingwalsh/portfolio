import React, { forwardRef } from 'react';

import { mdiMagnify } from '@mdi/js';
import Icon from '@mdi/react';
import { TextFieldProps, TextField } from '@mui/material';

export type StyledInputProps = TextFieldProps & {
    search?: boolean;
    translation?: string[];
};

export const StyledInput = forwardRef<HTMLDivElement, StyledInputProps>(({ variant = 'filled', label, search, translation, ...props }, ref) => {
    return (
        <TextField
            variant={variant}
            fullWidth
            maxRows={3}
            {...props}
            ref={ref}
            className={`styled__input ${label === undefined ? 'style__input__no__label' : ''}${props.className ? ` ${props.className}` : ''}${
                props.disabled ? ` input__disabled` : ''
            }`}
            label={label}
            InputProps={{
                ...props.InputProps,
                endAdornment: (
                    <div className='input__end__adornment__container'>
                        {props.InputProps?.endAdornment}
                        {search ? <Icon size={1} title='search' path={mdiMagnify} color='currentColor' /> : null}
                    </div>
                ),
            }}
        />
    );
});
