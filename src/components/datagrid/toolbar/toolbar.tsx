import { mdiViewColumnOutline, mdiFileTable, mdiSort } from '@mdi/js';
import Icon from '@mdi/react';
import React, { ReactNode, useRef, useState } from 'react';

import { DataGridColumn, useDataGridContext } from '../datagridcontext';

import { StyledButton } from '../../buttons/styledbutton';

import { toCSV } from '../utility/tocsv';
import { saveCSV } from '../utility/savecsv';
import { Menu, ButtonGroup, MenuItem, Checkbox } from '@mui/material';
import { ReactSortable } from 'react-sortablejs';

interface DatagridToolbarProps {}

/**
 *
 * @returns Toolbar buttons for table
 */
export const DatagridToolbar: React.FC<DatagridToolbarProps> = ({ children }) => {
    const [state, dispatch] = useDataGridContext();
    const { columns } = state;
    const stateRef = useRef(state);
    stateRef.current = state;
    // const isDragging = useRef(false);
    const [isDragging, setIsDragging] = useState(false);
    const [columnMenuAnchor, setColumnMenuAnchor] = useState<HTMLButtonElement>();
    const menuRef = useRef<ReactNode>();
    const sortableRef = useRef<HTMLDivElement>(null);

    /**
     * Attach columns menu to menu button
     */
    const onOpenColumnMenu: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
        setColumnMenuAnchor(evt.target as HTMLButtonElement);
    };

    /**
     * notify provider of active state of a given column
     */
    const onColumnToggle: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
        dispatch({ type: 'toggleColumn', payload: evt.currentTarget.dataset.id });
    };

    /**
     * Notify provider of change in order while actively sorting
     */
    // const onSort: SortOverHandler = ({ oldIndex, newIndex, collection }, evt) => {
    //     const newOrder = [...stateRef.current.columns];
    //     newOrder.splice(newIndex, 0, ...newOrder.splice(oldIndex, 1));
    //     dispatch({ type: 'columns', payload: newOrder });
    // };

    // if (!menuRef.current || !isDragging) {
    //     menuRef.current = (
    //         <SortableList
    //             helperContainer={() => sortableRef.current ?? document.body}
    //             helperClass='datagrid__sort__helper'
    //             columns={state.columns}
    //             onColumnToggle={onColumnToggle}
    //             onSortStart={() => setIsDragging(true)}
    //             onSortOver={onSort}
    //             onSortEnd={() => setIsDragging(false)}
    //         />
    //     );
    // }
    // const sortableMenu = menuRef.current;

    const onColumnOrder = (columns: DataGridColumn<{}>[]) => {
        dispatch({ type: 'columns', payload: columns });
    };

    return (
        <>
            <Menu
                ref={sortableRef}
                data-testid='columns__menu'
                open={!!columnMenuAnchor}
                anchorEl={columnMenuAnchor}
                onClose={() => {
                    setColumnMenuAnchor(undefined);
                }}
                BackdropProps={{ className: 'columns__menu__backdrop' }}
            >
                <ReactSortable list={columns} setList={onColumnOrder}>
                    {columns.map((c, i) => (
                        <MenuItem data-testid='column__menu__item'>
                            <div className='datagrid__tools__menu__item'>
                                <div className='datagrid__tools__menu__item__handle'>
                                    <Icon path={mdiSort} size={1} />
                                </div>
                                <span className='datagrid__tools__menu__item__title'>{c.title}</span>
                                <Checkbox checked={c.active} data-id={c.id} onClick={onColumnToggle} />
                            </div>
                        </MenuItem>
                    ))}
                </ReactSortable>
            </Menu>
            <div className='datagrid__tools' data-testid='datagrid__tools'>
                <ButtonGroup>
                    <StyledButton aria-label={'Show/Hide Columns'} title={'Show/Hide Columns'} data-testid='column__menu__button' variant='outlined' onClick={onOpenColumnMenu}>
                        <Icon path={mdiViewColumnOutline} size={1} />
                    </StyledButton>
                    {children}

                    <StyledButton aria-label={'Export'} title={'Export'} data-testid='toolbar__export' variant='outlined' onClick={() => saveCSV(toCSV(state as any))}>
                        <Icon path={mdiFileTable} size={1} />
                    </StyledButton>
                </ButtonGroup>
            </div>
        </>
    );
};
