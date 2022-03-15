import React, { ReactNode } from 'react';
import { StyledInput } from '../input/styledinput';
import { mdiChevronDown, mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { Virtuoso } from 'react-virtuoso';

import {
    AutocompleteChangeReason,
    AutocompleteChangeDetails,
    AutocompleteProps,
    useAutocomplete,
    CircularProgress,
    IconButton,
    Chip,
    Popper,
    ClickAwayListener,
    Paper,
    MenuItem,
    ListItemText,
    AutocompleteValue,
    AutocompleteGroupedOption,
} from '@mui/material';
import { clsx } from '../../helpers/utils';

export type StyledAutocompleteChangeEvent<
    T,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    FreeSolo extends boolean | undefined = undefined
> = { target: { name?: string; value: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo> } };

export type StyledAutocompleteChangeHandler<
    T,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    FreeSolo extends boolean | undefined = undefined
> = (
    event: StyledAutocompleteChangeEvent<T, Multiple, DisableClearable, FreeSolo>,
    value: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<T>
) => void;
export interface StyledAutocompleteProps<
    T,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    FreeSolo extends boolean | undefined = undefined
> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'renderInput' | 'options' | 'onChange'> {
    label?: string;
    helpText?: string;
    helpLabel?: string;
    translation?: string[];
    name?: string;
    required?: boolean;
    search?: boolean;
    getOptionSubText?: (option: T) => ReactNode;
    onChipClick?: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, option: T, optionIndex: number, valueIndex: number) => void;
    options?: T[];
    onChange?: StyledAutocompleteChangeHandler<T, Multiple, DisableClearable, FreeSolo>;
    type?: 'number' | 'text';
}

type OptionWithID = { id: string | number };
const defaultOptionSelected = (option: OptionWithID, value: OptionWithID) => option.id === value.id;
const defaultGetOptionLabel = (providedGetter?: (option: any) => string) => (option: any) => {
    const label = providedGetter?.(option);
    if (label !== undefined && label !== null) return label;
    if (typeof option === 'object') return JSON.stringify(option);
    else return option;
};

const setDiv: { component: 'div' } = { component: 'div' };
export function StyledAutocomplete<
    T,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    FreeSolo extends boolean | undefined = undefined
>({
    label,
    helpText,
    helpLabel,
    required,
    search,
    placeholder,
    getOptionSubText,
    translation,
    onChipClick,
    options = [],
    limitTags = 3,
    className,
    disabled,
    noOptionsText,
    onChange,
    type,
    ...props
}: StyledAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
    const testid = (props as any)['data-testid'];
    const labelGetter = defaultGetOptionLabel(props.getOptionLabel);
    const { getInputProps, getListboxProps, getOptionProps, groupedOptions, getRootProps, getTagProps, getPopupIndicatorProps, popupOpen, setAnchorEl, value, getClearProps } =
        useAutocomplete<T, Multiple, DisableClearable, FreeSolo>({
            filterOptions: (opt, state) => {
                const res = [];

                for (let o of opt) {
                    const l = labelGetter(o);
                    if (l.toLocaleLowerCase().includes(state.inputValue.toLocaleLowerCase())) {
                        res.push(o);
                    }
                }

                return res;
            },
            disableCloseOnSelect: props.multiple,
            ...props,
            options,
            isOptionEqualToValue: props.isOptionEqualToValue ?? ((options[0] as any)?.id !== undefined ? (defaultOptionSelected as any) : undefined),
            value: (props.value ? (props.multiple && !Array.isArray(props.value) ? [props.value] : props.value) : props.multiple ? [] : null) as any,
            getOptionLabel: labelGetter,
            onChange: (evt, value, reason, details) => onChange?.({ target: { name: props.name, value } }, value, reason, details),
        });
    const acInputProps = getInputProps() as { ref: React.MutableRefObject<HTMLDivElement> };

    const groupedItems = props.groupBy ? (groupedOptions as unknown as AutocompleteGroupedOption<T>) : [];
    const items = !props.groupBy ? (groupedOptions as unknown as T[]) : [];
    return (
        <div {...getRootProps()}>
            <StyledInput
                data-testid={testid}
                className={clsx('styled__autocomplete', className)}
                placeholder={placeholder}
                label={label}
                fullWidth
                search={search}
                required={required}
                translation={translation}
                disabled={disabled}
                type={type}
                InputProps={{
                    ...acInputProps,
                    endAdornment: (
                        <>
                            {props.loading ? <CircularProgress color='inherit' size={20} /> : null}
                            {value || (props.multiple && (value as T[])?.length) ? (
                                <div {...getClearProps()}>
                                    <IconButton color='inherit' data-testid='clear-button' className='icon-button__background-fix MuiAutocomplete-clearIndicator'>
                                        <Icon path={mdiClose} size={1} color='currentColor' />
                                    </IconButton>
                                </div>
                            ) : null}

                            <Icon {...getPopupIndicatorProps()} path={mdiChevronDown} size={1} color='currentColor' rotate={popupOpen ? -180 : 0} />
                        </>
                    ),
                    startAdornment:
                        props.multiple && (value as T[]).length ? (
                            <div className='styled__autocomplete__chips fullwidth'>
                                {(value as T[]).reduce((acc: ReactNode[], v, i) => {
                                    if (limitTags === -1 || (limitTags > -1 && i < limitTags) || popupOpen) {
                                        acc.push(
                                            <Chip
                                                {...getTagProps({ index: i })}
                                                key={i}
                                                className='styled__chip'
                                                label={labelGetter(v)}
                                                data-testid='autocomplete-chip'
                                                onClick={
                                                    onChipClick
                                                        ? (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                                                              //if we are here, there has to be a chip which has to have an index provided by material ui
                                                              const index = parseInt(evt.currentTarget.dataset.tagIndex!);

                                                              onChipClick(
                                                                  evt,
                                                                  (value as T[])[index],
                                                                  options.findIndex((o) => o === (value as T[])[index]),
                                                                  index
                                                              );
                                                          }
                                                        : undefined
                                                }
                                            />
                                        );
                                    }

                                    return acc;
                                }, [])}
                                {limitTags > -1 && !popupOpen && (value as T[]).length > limitTags ? (
                                    <Chip data-testid={'autocomplete-chip'} key='rest' className='styled__chip' label={`+ ${(value as T[]).length - limitTags} ${'More'}`} />
                                ) : null}
                            </div>
                        ) : null,
                }}
            />
            <Popper className={`styled__autocomplete__popper ${props.classes?.popper}`} placement='bottom-start' anchorEl={acInputProps.ref.current} open={popupOpen} transition>
                {({ TransitionProps, ...props }) => (
                    <ClickAwayListener onClickAway={() => setAnchorEl()}>
                        <Paper
                            className={clsx('styled__menu', 'styled__autocomplete__menu__paper', items.length > 100 && 'styled__autocomplete__virtual__container')}
                            style={{ width: acInputProps.ref.current.offsetWidth }}
                        >
                            <ul className={'styled__autocomplete__menu'} {...getListboxProps()} data-testid={testid + '_dropdown'}>
                                {items.length > 100 ? (
                                    <Virtuoso
                                        className='fullwidth'
                                        data-testid='virtual-list'
                                        data={items}
                                        itemContent={(index, option) => (
                                            <MenuItem {...getOptionProps({ option, index })}>
                                                <ListItemText<'div', 'div'>
                                                    primaryTypographyProps={setDiv}
                                                    secondaryTypographyProps={setDiv}
                                                    primary={labelGetter(option)}
                                                    secondary={getOptionSubText?.(option)}
                                                />
                                            </MenuItem>
                                        )}
                                    />
                                ) : items.length ? (
                                    items.map((option, index) => (
                                        <MenuItem {...getOptionProps({ option, index })}>
                                            <ListItemText<'div', 'div'>
                                                primaryTypographyProps={setDiv}
                                                secondaryTypographyProps={setDiv}
                                                primary={labelGetter(option)}
                                                secondary={getOptionSubText?.(option)}
                                            />
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem>
                                        <ListItemText<'div', 'div'> primaryTypographyProps={setDiv} secondaryTypographyProps={setDiv} primary={noOptionsText ?? 'No Options'} />
                                    </MenuItem>
                                )}
                            </ul>
                        </Paper>
                    </ClickAwayListener>
                )}
            </Popper>
        </div>
    );
}
