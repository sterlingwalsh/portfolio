import { cleanup, screen, render, act } from '../../../test-utils';
import { DatagridToolbar } from './toolbar';

import * as DataGridContext from '../datagridcontext';

import { gridTestProps, withProv } from '../tests/datagridcontext';
import userEvent from '@testing-library/user-event';

import * as SortableList from './sortablelist';

import * as ToCSV from '../utility/tocsv';
import * as SaveCSV from '../utility/savecsv';

describe('<Toolbar />', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	afterEach(() => {
		cleanup();
		jest.resetModules();
	});

	it('Renders', async () => {
		await act(async () => {
			render(withProv(<DatagridToolbar />));
		});

		const els = screen.getAllByTestId('datagrid__tools');
		expect(els.length).toBe(1);
		expect(screen.getAllByRole('button').length).toBe(2);
	});

	/**
	 * Menu has animation timing, so we can test the aria-hidden attributes used by
	 * Material UI to show and hide the menu
	 */
	it('Opens the column menu when button is clicked with an entry for each column, and closes on click away', async () => {
		await act(async () => {
			render(withProv(<DatagridToolbar />));
		});
		const button = screen.getByTestId('column__menu__button');
		expect(screen.queryByTestId('columns__menu')).toBeFalsy();
		act(() => {
			userEvent.click(button);
		});
		const menu = screen.getAllByTestId('columns__menu');
		expect(menu.length).toBe(1);
		expect(menu[0]).not.toHaveAttribute('aria-hidden');
		expect(screen.getAllByTestId('column__menu__item').length).toBe(2);

		const clickAway = menu[0].querySelector(' .columns__menu__backdrop');
		if (clickAway) {
			act(() => {
				userEvent.click(clickAway);
			});
		}
		expect(screen.getByTestId('columns__menu')).toHaveAttribute('aria-hidden', 'true');
	});

	it('Fires dispatch events when column is toggled off and on', async () => {
		const gridContextSpy = jest.spyOn(DataGridContext, 'useDataGridContext');
		await act(async () => {
			render(withProv(<DatagridToolbar />));
		});
		const button = screen.getByTestId('column__menu__button');
		act(() => {
			userEvent.click(button);
		});
		const menuItems = screen.getAllByTestId('column__menu__item');

		act(() => {
			userEvent.click(menuItems[0]);
		});
		let state = gridContextSpy.mock.results[gridContextSpy.mock.results.length - 1].value[0];
		expect(state.columns[0].active).toBe(false);

		act(() => {
			userEvent.click(menuItems[0]);
		});

		state = gridContextSpy.mock.results[gridContextSpy.mock.results.length - 1].value[0];
		expect(state.columns[0].active).toBe(true);
	});

	it('Fires dispatch events when columns are resorted', async () => {
		const gridContextSpy = jest.spyOn(DataGridContext, 'useDataGridContext');
		const dispatchSpy = jest.fn();
		gridContextSpy.mockImplementation(() => [gridTestProps as any, dispatchSpy]);

		jest.spyOn(SortableList, 'SortableList').mockImplementation(MockContainer as any);

		await act(async () => {
			render(withProv(<DatagridToolbar />));
		});

		const button = screen.getByTestId('column__menu__button');
		act(() => {
			userEvent.click(button);
		});

		const onChange = await screen.findByText('On Change');
		act(() => userEvent.click(onChange));
		expect(dispatchSpy.mock.calls.filter((c) => c[0].type === 'columns').length).toBe(1);

		const onStart = await screen.findByText('On Start');
		act(() => userEvent.click(onStart));

		// act(() => userEvent.click(menuButton));

		const onEnd = await screen.findByText('On End');
		act(() => userEvent.click(onEnd));
		act(() => userEvent.click(onChange));
	});

	it('Triggers table saving', async () => {
		const toSpy = jest.spyOn(ToCSV, 'toCSV');
		toSpy.mockImplementation(() => ({
			headers: ['h1', 'h2'],
			rowData: [
				['1', '2'],
				['a', 'b'],
			],
		}));
		const saveSpy = jest.spyOn(SaveCSV, 'saveCSV');
		saveSpy.mockImplementation(() => undefined);

		await act(async () => {
			render(withProv(<DatagridToolbar />));
		});
		const button = screen.getByTestId('toolbar__export');

		await act(async () => {
			userEvent.click(button);
		});
		expect(toSpy).toHaveBeenCalledTimes(1);
		expect(saveSpy).toHaveBeenCalledTimes(1);
	});
});

const MockContainer = (props: any) => {
	props.helperContainer();
	return (
		<div>
			<div>Sortable</div>
			{props.onSortOver && (
				<button type="button" onClick={() => props.onSortOver({ newIndex: 1, oldIndex: 0 })}>
					On Change
				</button>
			)}
			{props.onSortStart && (
				<button type="button" onClick={() => props.onSortStart()}>
					On Start
				</button>
			)}
			{props.onSortEnd && (
				<button type="button" onClick={() => props.onSortEnd()}>
					On End
				</button>
			)}
			{props.children}
		</div>
	);
};
