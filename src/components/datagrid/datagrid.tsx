import { TablePagination } from '@mui/material';
import React, { useMemo, useRef, ReactNode } from 'react';
import { Loading } from '../../feedback/loading';

import { CellClickFunction, DataGridProvider, IDataGrid, useDataGridContext } from './datagridcontext';
import { TableWrapper } from './tablewrapper';
import { DatagridToolbar } from './toolbar/toolbar';

interface DataGridComponentProps {
    Toolbar?: ReactNode;
    onCellClick?: CellClickFunction;
    wrapCells?: boolean;
}

export const DataGridComponent: React.FC<DataGridComponentProps> = ({ Toolbar, onCellClick, wrapCells }) => {
    const [state, dispatch] = useDataGridContext();
    const stateRef = useRef(state);
    stateRef.current = state;
    const { rows, sortedRows, page, rowsPerPage } = state;

    /**
     * memo rows based on pagination settings using he sorted data
     */

    const rowsPage = useMemo(() => {
        const start = page * rowsPerPage;
        return sortedRows?.slice(start, start + rowsPerPage);
    }, [sortedRows, page, rowsPerPage]);

    return (
        <div data-testid='datagrid__wrapper' className={`datagrid__wrapper`}>
            <Loading data-testid='datagrid-loading' show={state.loading} />
            <TableWrapper
                rows={rowsPage}
                pagination={
                    <TablePagination
                        className='datagrid__pagination'
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(evt, p) => dispatch({ type: 'page', payload: p })}
                        onRowsPerPageChange={(evt) => dispatch({ type: 'rowsPerPage', payload: parseInt(evt.target.value) })}
                        color='inherit'
                    />
                }
                tools={Toolbar ?? <DatagridToolbar />}
                wrapCells={wrapCells}
                onCellClick={onCellClick}
            />
        </div>
    );
};

export function DataGrid<T>({ Toolbar, wrapCells, onCellClick, ...props }: IDataGrid<T>) {
    return (
        <DataGridProvider {...props}>
            <DataGridComponent Toolbar={Toolbar} onCellClick={onCellClick} wrapCells={wrapCells} />
        </DataGridProvider>
    );
}
