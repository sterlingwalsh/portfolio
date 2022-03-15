import { DataGridState } from '../datagridcontext';

type HandleSortProps<T> = Pick<DataGridState<T>, 'rows' | 'columns' | 'sortKey' | 'sortDir' | 'defaultGetValue'>;

export const handleSort = <T>(state: HandleSortProps<T>) => {
    const r = [...state.rows];
    const c = state.columns.find((col) => col.id === state.sortKey);
    if (!c) return r;
    r.sort((a, b) => {
        let comp = 0;
        if (c.sort) {
            comp = c.sort(a, b);
        } else {
            const aVal = c?.getValue?.(a, c.id) ?? state.defaultGetValue?.(a, c.id) ?? (a as { [index: string]: any })[c.id];
            const bVal = c?.getValue?.(b, c.id) ?? state.defaultGetValue?.(b, c.id) ?? (b as { [index: string]: any })[c.id];
            if (typeof aVal === 'string') {
                comp = aVal.localeCompare(bVal);
            } else {
                comp = aVal - bVal;
            }
        }

        return comp * state.sortDir;
    });
    return r;
};
