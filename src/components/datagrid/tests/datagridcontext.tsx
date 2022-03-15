import { ReactNode } from 'react';
import { DataGridProvider } from '../datagridcontext';

export const gridTestProps = {
    rowsPerPage: 25,
    page: 0,
    sortDir: 1,
    columns: [
        { id: 'name', active: true, wrap: true },
        { id: 'key', active: true, width: 200 },
    ],
    rows: [
        {
            key: '1',
            name: 'c',
        },
        { key: '2', name: 'b' },
        { key: '3', name: 'a' },
    ],
    getRowKey: (r: any) => r.key,
};

export const withProv = (children: ReactNode) => {
    return <DataGridProvider {...gridTestProps}>{children}</DataGridProvider>;
};
