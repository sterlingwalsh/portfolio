import { Resizable, ResizableProps } from 're-resizable';
import React, { forwardRef } from 'react';
import { DataGridColumn, useDataGridContext } from './datagridcontext';

interface HeaderItemDisplayProps {
    column: DataGridColumn;
    componentRef: React.LegacyRef<HTMLDivElement>;
}

type HeaderItemProps = ResizableProps &
    HeaderItemDisplayProps & {
        width?: number;

        // LegacyRef is expected type from re-resizable library
    };

/**
 * resize and display wrapper for table headers
 */

export const HeaderItem = forwardRef<Resizable, HeaderItemProps>(({ column, children, width, componentRef, ...props }, ref) => {
    return (
        // <th className="datagrid__header__item" style={width !== undefined ? { ...style, width } : style}>
        <Resizable
            ref={ref}
            className='datagrid__resize__header'
            data-testid={'datagrid__resize__header'}
            enable={{
                top: false,
                right: true,
                bottom: false,
                left: false,
                topRight: false,
                bottomRight: false,
                bottomLeft: false,
                topLeft: false,
            }}
            defaultSize={{ width: 'auto', height: 'auto' }}
            handleClasses={{ right: 'datagrid__header__handle' }}
            {...props}
        >
            <HeaderItemDisplay column={column} componentRef={componentRef}>
                {children}
            </HeaderItemDisplay>
        </Resizable>
        // </th>
    );
});

/**
 *
 * @param param0 Isolating the display only portion of the header
 * @returns
 */

export const HeaderItemDisplay: React.FC<HeaderItemDisplayProps> = ({ column, children, componentRef }) => {
    const [state, dispatch] = useDataGridContext();
    const sortDir = state.sortKey === column.id ? state.sortDir : 0;
    return (
        <div
            ref={componentRef}
            data-testid='header__item__display'
            className={`datagrid__header__spacing${sortDir === 1 ? ' datagrid__header__asc' : sortDir === -1 ? ' datagrid__header__desc' : ''}`}
            onClick={() => dispatch({ type: 'sortKey', payload: column.id })}
        >
            {children}
        </div>
    );
};
