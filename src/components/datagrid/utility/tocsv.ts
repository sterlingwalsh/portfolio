import { DataGridCreateCSVFunction } from './datagridexport';
import { handleSort } from './handlesort';

export const toCSV: DataGridCreateCSVFunction = (state, opts) => {
    const { columns, defaultGetValue } = state;
    const filteredColumns = columns.filter((c) => c.active || opts?.allColumns);
    const headers: string[] = filteredColumns.map((c) => c.title ?? c.id);
    const sortedRows = handleSort(state);
    const rowData: string[][] = sortedRows.map((r) =>
        filteredColumns.map((c) => `"${c.getValue?.(r, c.id) ?? defaultGetValue?.(r, c.id) ?? (r as { [index: string]: any })[c.id]}"`)
    );
    return { headers, rowData };
};
