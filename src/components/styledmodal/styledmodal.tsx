import { mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { ModalProps, Modal, Grow, Typography, IconButton } from '@mui/material';
import React, { FormEventHandler } from 'react';
import { createContext, ReactNode, useContext } from 'react';
import { Loading } from '../../feedback/loading';

type OnClose = (evt: any) => void;

export interface StyledModalProps extends Omit<ModalProps, 'children' | 'onSubmit' | 'onChange'> {
    onClose?: OnClose;
    children?: Pick<React.PropsWithChildren<{}>, 'children'>;
    size?: 'xl' | 'lg' | 'md' | 'sm';
    forceMax?: boolean;
    onSubmit?: FormEventHandler<HTMLFormElement>;
}

const ModalContext = createContext({});
interface ModalControls {
    onClose?: OnClose;
}
const useModalContext = (): ModalControls => useContext(ModalContext);

export const StyledModal: React.FC<StyledModalProps> = ({ children, className, size = 'md', forceMax, onClose, onSubmit, ...props }) => {
    return props.open ? (
        <ModalContext.Provider value={{ onClose }}>
            <Modal {...props} onClose={onClose} className='styled__modal flex-center' closeAfterTransition>
                <Grow in={props.open}>
                    <form onSubmit={onSubmit} className={`styled__modal__contents${className ? ` ${className}` : ''} styled__modal__${size}${forceMax ? ' force-max' : ''}`}>
                        {children}
                    </form>
                </Grow>
            </Modal>
        </ModalContext.Provider>
    ) : null;
};

interface ModalHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
    text?: ReactNode;
    onCloseHeader?: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ text, children, onCloseHeader, ...props }) => {
    const { onClose } = useModalContext();
    return (
        <div className={`window__header${props.className ? ` ${props.className}` : ''}`}>
            <div className='window__title'>
                {text && <Typography variant='h6'>{text}</Typography>}
                {children}
            </div>
            <IconButton data-testid='styled-modal-close' color='inherit' onClick={onCloseHeader ?? onClose}>
                <Icon path={mdiClose} size={0.75} />
            </IconButton>
        </div>
    );
};

interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    noPadding?: boolean;
    noScroll?: boolean;
    loading?: boolean;
}

export const ModalBody: React.FC<ModalBodyProps> = ({ noPadding, children, noScroll, loading, ...props }) => (
    <div {...props} className={`modal___body${props.className ? ` ${props.className}` : ''}${noPadding ? ` nopadding` : ''}`}>
        <Loading show={loading} local />
        <div className={`modal__body__scroll__wrapper${noScroll ? ' noScroll' : ''}`}>{children}</div>
    </div>
);

export const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
    <div {...props} className={`modal___footer${props.className ? ` ${props.className}` : ''}`}>
        {children}
    </div>
);
