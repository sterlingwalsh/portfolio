import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';
import { useEffect } from 'react';
import { IAction } from '../../types/store';

import { handleSort } from './utility/handlesort';

export type GetValueFunction<T> = (row: T, key: string) => ReactNode;
export type GetRowKeyFunction<T> = (row: T) => string | number;
export type CellClickFunction<T = any> = (row: T, colKey: string) => void;
export interface DataGridColumn<T = {}> {
    active?: boolean;
    id: string;
    title?: string;
    getValue?: GetValueFunction<T>;
    sort?: (a: T, b: T) => number;
    width?: number;
    wrap?: boolean;
}
export interface IDataGrid<T extends {} = {}> {
    rows: T[];
    columns: DataGridColumn<T>[];
    getRowKey: GetRowKeyFunction<T>;
    defaultGetValue?: GetValueFunction<T>;
    loading?: boolean;
    Toolbar?: ReactNode;
    wrapCells?: boolean;
    onCellClick?: CellClickFunction<T>;
    selectedRow?: string | number;
}

const DataGridContext: any = createContext({});

export interface DataGridState<T = {}> extends IDataGrid<T> {
    // features?: __esri.FeatureSet;
    sortedRows?: T[];
    rowsPerPage: number;
    page: number;
    sortKey?: string;
    sortDir: 1 | -1;
    columns: DataGridColumn<T>[];
}

export type DataGridActions = keyof DataGridState | 'toggleColumn';

export const useDataGridContext = (): [DataGridState, Dispatch<IAction<DataGridActions>>] => useContext(DataGridContext);

type DataGridReducer<T = {}> = (state: DataGridState<T>, action: IAction<DataGridActions>) => DataGridState<T>;

export const reducer: DataGridReducer = (state: DataGridState, action: IAction<DataGridActions>) => {
    const newState = { ...state };

    switch (action.type) {
        case 'toggleColumn':
            newState.columns = newState.columns.map((c, i) => (c.id === action.payload ? { ...c, active: !c.active } : c));
            break;
        case 'rows':
            newState[action.type] = action.payload;
            newState.sortedRows = handleSort(newState);
            break;
        case 'selectedRow':
        case 'rowsPerPage':
        case 'page':
        case 'columns':
            newState[action.type] = action.payload;
            break;
        case 'loading':
            newState[action.type] = action.payload;
            break;
        case 'sortDir':
            newState[action.type] = action.payload;
            newState.sortedRows = handleSort(newState);
            break;
        case 'sortKey':
            if (action.payload === newState.sortKey) {
                newState.sortDir *= -1;
            } else {
                newState[action.type] = action.payload;
            }
            newState.sortedRows = handleSort(newState);
            break;

        default:
            return state;
    }
    return newState;
};

/**
 *
 * Local provider for table functionality
 *
 * @param layer layer for which to display data
 * @returns
 */

export function DataGridProvider<T>({ children, rows, columns, getRowKey, defaultGetValue, selectedRow, loading }: React.PropsWithChildren<IDataGrid<T>>) {
    const context = useReducer<React.Reducer<DataGridState<T>, any>, DataGridState<T>>(
        reducer as unknown as DataGridReducer<T>,
        {
            rowsPerPage: 25,
            page: 0,
            sortDir: 1,
            rows: rows,
            columns,
            getRowKey,
            defaultGetValue,
        },
        (s) => s
    );

    const [, dispatch] = context;

    useEffect(() => {
        dispatch({ type: 'loading', payload: loading });
    }, [loading, dispatch]);

    useEffect(() => {
        dispatch({ type: 'rows', payload: rows });
    }, [rows, dispatch]);

    useEffect(() => {
        dispatch({ type: 'selectedRow', payload: selectedRow });
    }, [selectedRow, dispatch]);

    return <DataGridContext.Provider value={context}>{children}</DataGridContext.Provider>;
}
