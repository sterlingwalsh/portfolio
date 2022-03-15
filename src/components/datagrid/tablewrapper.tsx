import { Resizable, ResizeCallback } from 're-resizable';
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { CellClickFunction, DataGridColumn, useDataGridContext } from './datagridcontext';
import { HeaderItem } from './headeritem';

export interface TableWrapperProps<T> {
    rows?: T[];
    pagination?: ReactNode;
    tools?: ReactNode;
    wrapCells?: boolean;
    onCellClick?: CellClickFunction;
}

interface TableWrapperState {
    wrapperRef?: HTMLDivElement | null;
    tableRef?: HTMLTableElement | null;
    styleRef?: HTMLStyleElement | null;
    colRefs: { [index: string]: HTMLTableColElement | null };
    selectedCol?: string;
    colWidths: { [index: string]: number | undefined };
    resizeRefs: { [index: string]: Resizable | null };
    resizeComponentRefs: { [index: string]: HTMLDivElement | null };
    headerRef: HTMLDivElement | null;
    lastScrollPos?: number;
    scrollTicking?: boolean;
    lastResize?: number;
    resizeTicking?: boolean;
    initialLayout?: boolean;
}

/**
 * Wrap together the interactive portions of the table
 */

export function TableWrapper<T extends {}>({ rows, pagination, tools, onCellClick, wrapCells }: TableWrapperProps<T>) {
    const [state, dispatch] = useDataGridContext();
    const { columns, getRowKey, defaultGetValue, selectedRow } = state;
    const tableWrapperState = useRef<TableWrapperState>({
        colRefs: {},
        resizeRefs: {},
        headerRef: null,
        colWidths:
            columns?.reduce((acc: { [index: string]: number | undefined }, c) => {
                if (c.width) {
                    acc[c.id] = c.width;
                }
                return acc;
            }, {}) ?? {},
        resizeComponentRefs: {},
    });
    const [initWidths, setInitWidths] = useState(true);

    /**
     * On resize of a column header, adjust the table's col elements to control the width of the
     * table's columns
     */

    const onResize = useCallback(
        (key: string): ResizeCallback =>
            (e, dir, el, delta) => {
                tableWrapperState.current.lastResize = el.offsetWidth;
                requestAnimationFrame(() => {
                    tableWrapperState.current.colRefs[key]!.style.width = tableWrapperState.current.lastResize! + 1 + 'px';
                    tableWrapperState.current.colWidths[key] = tableWrapperState.current.lastResize;

                    if (tableWrapperState.current.headerRef && tableWrapperState.current.lastScrollPos !== undefined) {
                        tableWrapperState.current.headerRef.scrollLeft = tableWrapperState.current.lastScrollPos;
                    }
                    if (tableWrapperState.current.tableRef && tableWrapperState.current.lastScrollPos !== undefined) {
                        tableWrapperState.current.tableRef.scrollLeft = tableWrapperState.current.lastScrollPos;
                    }
                    tableWrapperState.current.resizeTicking = false;
                });
                tableWrapperState.current.resizeTicking = true;
            },
        [tableWrapperState]
    );

    /**
     * On horizontal scroll, match the scroll position of the header and table
     */

    const onScroll: React.UIEventHandler<HTMLDivElement> = (evt) => {
        tableWrapperState.current.lastScrollPos = (evt.target as any).scrollLeft;
        // console.log(tableWrapperState.current.lastScrollPos);
        if (!tableWrapperState.current.scrollTicking) {
            requestAnimationFrame(() => {
                tableWrapperState.current.scrollTicking = false;
                tableWrapperState.current.headerRef!.scrollLeft = tableWrapperState.current.lastScrollPos!;
                // console.log("set", tableWrapperState.current.lastScrollPos);
            });
        }
        tableWrapperState.current.scrollTicking = true;
    };

    /**
     * Allow the table to lay out it's own header cells and body cells and then properly adjust widths to match
     */

    useEffect(() => {
        if (rows && columns && initWidths) {
            const cells: NodeListOf<HTMLTableCellElement> | undefined = tableWrapperState.current.tableRef!.querySelectorAll('tbody tr:first-of-type td');
            if (cells.length) {
                cells.forEach((c) => {
                    const key = c.dataset.field;
                    /* istanbul ignore else */
                    if (key) {
                        const savedW = tableWrapperState.current.colWidths[key];
                        const cellW = c.offsetWidth;
                        const resize = tableWrapperState.current.resizeRefs[key];
                        const resizeW = resize!.size.width;
                        const w = savedW ?? Math.max(resizeW + 1, cellW);
                        tableWrapperState.current.colWidths[key] = w;

                        resize!.updateSize({ width: w, height: resize!.size.height });
                    }
                });
                setInitWidths(false);
            }
        }
    }, [tableWrapperState, rows, columns, initWidths, setInitWidths]);

    /**
     * On mouse over highlight col and column header elements. row highlight is handled via css
     */

    const onMouseOver: React.MouseEventHandler<HTMLTableSectionElement> = useCallback(
        (evt) => {
            const t = evt.target as HTMLTableCellElement;
            const key = t.dataset?.field;
            if (key && key !== tableWrapperState.current.selectedCol) {
                tableWrapperState.current.colRefs[key]?.classList.add('datagrid__selected__col');
                tableWrapperState.current.resizeComponentRefs[key]?.classList.add('datagrid__selected__col');

                if (tableWrapperState.current.selectedCol) {
                    tableWrapperState.current.colRefs[tableWrapperState.current.selectedCol]?.classList.remove('datagrid__selected__col');
                    tableWrapperState.current.resizeComponentRefs[tableWrapperState.current.selectedCol]?.classList.remove('datagrid__selected__col');
                }
                tableWrapperState.current.selectedCol = key;
            }
        },
        [tableWrapperState]
    );

    /**
     * Clear Highlights
     */

    const onMouseLeave: React.MouseEventHandler<HTMLTableSectionElement> = useCallback(() => {
        if (tableWrapperState.current.selectedCol) {
            tableWrapperState.current.colRefs[tableWrapperState.current.selectedCol]?.classList.remove('datagrid__selected__col');
            tableWrapperState.current.resizeComponentRefs[tableWrapperState.current.selectedCol]?.classList.remove('datagrid__selected__col');
        }
        tableWrapperState.current.selectedCol = undefined;
    }, [tableWrapperState]);

    /**
     * Only display active columns
     */
    // const activeColumns = useMemo(() => columns?.filter((c) => c.active) ?? [], [columns]);

    /**
     * On cell click, extract the row and column data and fire provided onCellClick
     */

    const handleCellClick: React.MouseEventHandler<HTMLTableSectionElement> = (evt) => {
        if (onCellClick) {
            const cell = evt.target as HTMLTableCellElement;
            const row = rows?.[parseInt(cell.dataset.row!)];
            onCellClick(row, cell.dataset.field!);
        }
    };

    const onColumnOrder = (columns: DataGridColumn<{}>[]) => {
        dispatch({ type: 'columns', payload: columns });
    };

    return (
        <div data-testid='table__wrapper' className='datagrid__table__wrapper' ref={(r) => (tableWrapperState.current.wrapperRef = r)}>
            <div data-testid='datagrid__header' className='datagrid__header flex_header' ref={(r) => (tableWrapperState.current.headerRef = r)}>
                <ReactSortable list={columns} setList={onColumnOrder}>
                    {columns.map((c, i, arr) =>
                        c.active ? (
                            <HeaderItem
                                key={c.id}
                                ref={(r) => {
                                    tableWrapperState.current.resizeRefs[c.id] = r;
                                }}
                                componentRef={(r) => (tableWrapperState.current.resizeComponentRefs[c.id] = r)}
                                onResize={onResize(c.id)}
                                column={c as DataGridColumn<{}>}
                                defaultSize={{ width: tableWrapperState.current.colWidths[c.id] ?? 'auto', height: 'auto' }}
                            >
                                {c.title}
                            </HeaderItem>
                        ) : null
                    )}
                </ReactSortable>
                <div className='datagrid__header__scroll__spacer' />
            </div>
            <div data-testid='datagrid__table' className='datagrid__table' onScroll={onScroll}>
                <table className={`datagrid${initWidths ? '' : ' has-loaded'}`} ref={(r) => (tableWrapperState.current.tableRef = r)}>
                    {!initWidths && (
                        <colgroup>
                            {columns.map((c) => {
                                return c.active ? (
                                    <col key={c.id} style={{ width: tableWrapperState.current.colWidths[c.id] }} ref={(r) => (tableWrapperState.current.colRefs[c.id] = r)} />
                                ) : null;
                            })}
                        </colgroup>
                    )}

                    <tbody onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} onClick={handleCellClick}>
                        {rows?.map((r, i) => {
                            const rKey = getRowKey(r);
                            return (
                                <tr data-testid='table__row' key={rKey} aria-selected={rKey === selectedRow}>
                                    {columns.map((c) =>
                                        c.active ? (
                                            <td className={c.wrap ?? wrapCells ? 'cell__wrap' : ''} data-field={c.id} data-row={i} key={c.id}>
                                                {c.getValue?.(r, c.id) ?? defaultGetValue?.(r, c.id) ?? (r as { [index: string]: any })[c.id]}
                                            </td>
                                        ) : null
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className='datagrid__footer'>
                <div>{tools}</div>
                <div>{pagination}</div>
            </div>
        </div>
    );
}
