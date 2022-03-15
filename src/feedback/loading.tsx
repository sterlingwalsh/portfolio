import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';
import { clsx } from '../helpers/utils';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
    show?: boolean;
    local?: boolean;
}
export const Loading: React.FC<LoadingProps> = ({ show, local, children, ...props }) =>
    show ? (
        <div {...props} className={clsx('loading__wrapper', local && 'loading__local')}>
            <Backdrop open={true} />
            <CircularProgress />
            {children}
        </div>
    ) : null;
