import React from 'react';
import { cleanup, render, screen, act, fireEvent } from '../../test-utils';

import { DataGrid } from './datagrid';
import { gridTestProps } from './tests/datagridcontext';

import * as DataGridContext from './datagridcontext';

describe('<DataGrid />', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.restoreAllMocks();
		cleanup();
		jest.resetModules();
	});

	it('Renders', async () => {
		await act(async () => {
			render(<DataGrid {...gridTestProps} />);
		});

		expect(screen.getAllByTestId('datagrid__wrapper').length).toBe(1);
	});

	it('Dispatches to reducer onChangePage', async () => {
		const contextSpy = jest.spyOn(DataGridContext, 'useDataGridContext');
		const dispatchSpy = jest.fn();
		contextSpy.mockImplementation(() => [
			{ ...gridTestProps, rows: new Array(200).fill(null).map((n, i) => ({ key: i, name: 'n' + i })) } as any,
			dispatchSpy,
		]);

		await act(async () => {
			render(<DataGrid {...gridTestProps} />);
		});
		const paginationButton = document.querySelectorAll('.MuiTablePagination-actions > button')[1];

		if (paginationButton) {
			fireEvent.click(paginationButton);
		}
		const call = dispatchSpy.mock.calls[0];
		expect(call[0].type).toBe('page');
	});

	it('Dispatches to reducer onChangeRowsPerPage', async () => {
		const contextSpy = jest.spyOn(DataGridContext, 'useDataGridContext');
		const dispatchSpy = jest.fn();
		contextSpy.mockImplementation(() => [
			{ ...gridTestProps, rows: new Array(200).fill(null).map((n, i) => ({ key: i, name: 'n' + i })) } as any,
			dispatchSpy,
		]);

		await act(async () => {
			render(<DataGrid {...gridTestProps} />);
		});

		const selectButton = document.querySelector('.MuiTablePagination-selectRoot > [role="button"]');
		if (selectButton) {
			await act(async () => {
				fireEvent.mouseDown(selectButton);
			});
		}
		const menuButtons = document.querySelectorAll('.MuiPopover-root li');
		if (menuButtons[0]) {
			fireEvent.click(menuButtons[0]);
		}
		const call = dispatchSpy.mock.calls[0];
		expect(call[0].type).toBe('rowsPerPage');
	});
});
