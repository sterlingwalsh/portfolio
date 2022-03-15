import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

import { killEvt } from '../../helpers/utils';
import { StyledButton, StyledButtonProps } from '../buttons/styledbutton';
import { StyledInput } from '../input/styledinput';
import { StyledModalProps, StyledModal, ModalHeader, ModalBody, ModalFooter } from '../styledmodal/styledmodal';

/**
 * Confirm Provider
 * example use
 * 
 * 	const confirm = useConfirm();
 * 	confirm({
 * 				input: true,
				title: t('Modal Title'),
				description: t('Description what this modal is about'),
				actions: [
					{
						text: 'Confirm',
						variant: 'contained',
						color: 'action',
						onClick: (evt, inputValue) =>
							dispatch({
								type: 'action',
								payload: inputValue,
							}),
					},
					{
						text: 'Cancel',
						variant: 'contained',
					},
				],
			});
 */

const ConfirmContext: any = createContext({});

type ConfirmFunction = (options: Partial<ConfirmOptions>) => void;
export const useConfirm = (): ConfirmFunction => useContext(ConfirmContext);

type ConfirmAction = Omit<StyledButtonProps, 'onClick'> & {
    text?: string;
    onClick?: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, inputVal: string) => void;
    close?: boolean;
    'data-testid'?: string;
};

interface ConfirmOptions {
    'data-testid'?: string;
    title?: string;
    description?: ReactNode;
    actions: ConfirmAction[];
    variant?: 'input' | 'typeConfirm';
    inputLabel?: string;
    confirmString?: string;
    onClose?: (evt: any) => void;
    onSubmit?: (evt: React.FormEvent<HTMLFormElement>, inputVal: string) => void;
}

interface ConfirmProps extends ConfirmOptions {
    close: () => void;
}

const initialOptions: ConfirmOptions = {
    actions: [
        {
            type: 'submit',
            text: 'OK',
            color: 'action',
            variant: 'contained',
        },
        {
            text: 'Cancel',
            variant: 'contained',
            close: true,
        },
    ],
};

export const ConfirmProvider: React.FC = ({ children }) => {
    const [options, setOptions] = useState<ConfirmOptions>({ ...initialOptions, actions: initialOptions.actions.map((o) => ({ ...o, text: o.text })) });
    const [open, setOpen] = useState(false);
    const confirm: ConfirmFunction = useCallback(
        (options) => {
            setOptions({ ...initialOptions, actions: initialOptions.actions.map((o) => ({ ...o, text: o.text })), ...options });
            setOpen(true);
        },
        [setOptions, setOpen]
    );
    return (
        <ConfirmContext.Provider value={confirm}>
            <ConfirmModal open={open} close={() => setOpen(false)} {...options} />
            {children}
        </ConfirmContext.Provider>
    );
};

/**
 *
 * @param variant input: add simple input value that will be passed back in button callbacks. typeConfirm: requires a specific user input to proceed
 * @param confirmString comparison string relevant to typeConfirm variant
 * @returns void. opens modal instead
 */

const ConfirmModal: React.FC<Omit<StyledModalProps, 'onSubmit'> & ConfirmProps> = ({
    title,
    actions,
    description,
    variant,
    inputLabel,
    onSubmit,
    close,
    onClose,
    confirmString,
    ...props
}) => {
    const [inputVal, setInputVal] = useState('');
    const handleClose = (evt?: any) => {
        setInputVal('');
        onClose?.(evt);
        close();
    };
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (evt) => {
        killEvt(evt);
        onSubmit?.(evt, inputVal);
        handleClose();
    };
    const handleClick =
        (action: ConfirmAction): React.MouseEventHandler<HTMLButtonElement> =>
        (evt) => {
            action.onClick?.(evt, inputVal);
            handleClose();
        };
    return (
        <StyledModal data-testid='confirm-dialog-modal' {...props} onClose={handleClose} onSubmit={handleSubmit}>
            <ModalHeader text={title}></ModalHeader>
            <ModalBody>
                <div key='body' className='form__layout confirm__modal__body'>
                    <div>{description}</div>
                    {variant === 'input' || variant === 'typeConfirm' ? (
                        <StyledInput
                            data-testid='confirm-input'
                            label={variant === 'typeConfirm' ? `Type '${confirmString || 'Confirm'}' to proceed` : inputLabel}
                            multiline
                            maxRows={5}
                            required={variant === 'input'}
                            value={inputVal}
                            onChange={(evt) => setInputVal(evt.target.value)}
                        />
                    ) : null}
                </div>
            </ModalBody>
            <ModalFooter>
                <div key='button__row' className='button__row'>
                    {actions.map(({ text, close, ...a }) => (
                        <StyledButton
                            key={text}
                            {...a}
                            onClick={a.type === 'submit' ? undefined : close ? handleClose : handleClick(a)}
                            disabled={!close && variant === 'typeConfirm' && inputVal !== confirmString}
                        >
                            {text}
                        </StyledButton>
                    ))}
                </div>
            </ModalFooter>
        </StyledModal>
    );
};
