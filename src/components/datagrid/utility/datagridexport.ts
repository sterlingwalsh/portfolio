import { DataGridColumn, DataGridState } from '../datagridcontext';

export type DataGridExportState<T extends {} = {}> = Pick<DataGridState<T>, 'rows' | 'sortKey' | 'sortDir'> & {
	defaultGetValue?: (row: T, key: string) => string;
	columns: (Omit<DataGridColumn<T>, 'getValue'> & { getValue?: (row: T, key: string) => string })[];
};

interface DataGridExportOptions {
	allColumns?: boolean;
}

export type DataGridCSVData = { headers: string[]; rowData: (string | number)[][] };

export type DataGridCreateCSVFunction = (state: DataGridExportState, options?: DataGridExportOptions) => DataGridCSVData;
