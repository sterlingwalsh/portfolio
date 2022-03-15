import { cleanup, render, screen, fireEvent, act } from '../../test-utils';
import { getFields } from '../../tests/data/layer';
import { HeaderItem, HeaderItemDisplay } from './headeritem';

import * as DataGridContext from './datagridcontext';
import { gridTestProps, withProv } from './tests/datagridcontext';

describe('<HeaderItem />', () => {
	it('Renders', async () => {
		const ref: React.LegacyRef<HTMLDivElement> = { current: null };
		await act(async () => {
			render(withProv(<HeaderItem column={gridTestProps.columns[0]} componentRef={ref} />));
		});

		const res = screen.getAllByTestId('datagrid__resize__header');
		expect(res.length).toBe(1);
	});
});

describe('<HeaderItemDisplay />', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	afterEach(() => {
		cleanup();
		jest.resetModules();
	});

	it('Renders', async () => {
		const ref: React.LegacyRef<HTMLDivElement> = { current: null };
		await act(async () => {
			render(
				withProv(
					<HeaderItemDisplay column={gridTestProps.columns[0]} componentRef={ref}>
						things
					</HeaderItemDisplay>
				)
			);
		});

		const res = screen.getAllByTestId('header__item__display');
		expect(res.length).toBe(1);
	});

	it('Displays proper sort direction - asc', async () => {
		jest.spyOn(DataGridContext, 'useDataGridContext').mockImplementation(() => [{ sortKey: 'name', sortDir: 1 } as any, () => {}]);
		const ref: React.LegacyRef<HTMLDivElement> = { current: null };
		await act(async () => {
			render(
				withProv(
					<HeaderItemDisplay column={gridTestProps.columns[0]} componentRef={ref}>
						things
					</HeaderItemDisplay>
				)
			);
		});

		const el = screen.getByTestId('header__item__display');
		expect(el.classList.contains('datagrid__header__asc')).toBeTruthy();
		expect(el.classList.contains('datagrid__header__desc')).toBeFalsy();
	});

	it('Displays proper sort direction - desc', async () => {
		jest.spyOn(DataGridContext, 'useDataGridContext').mockImplementation(() => [{ sortKey: 'name', sortDir: -1 } as any, () => {}]);
		const ref: React.LegacyRef<HTMLDivElement> = { current: null };
		await act(async () => {
			render(
				withProv(
					<HeaderItemDisplay column={gridTestProps.columns[0]} componentRef={ref}>
						things
					</HeaderItemDisplay>
				)
			);
		});

		const el = screen.getByTestId('header__item__display');
		expect(el.classList.contains('datagrid__header__desc')).toBeTruthy();
		expect(el.classList.contains('datagrid__header__asc')).toBeFalsy();
	});

	it('Displays no sort when not sorted by this field', async () => {
		jest.spyOn(DataGridContext, 'useDataGridContext').mockImplementation(() => [{ sortField: '123' } as any, () => {}]);
		const ref: React.LegacyRef<HTMLDivElement> = { current: null };
		await act(async () => {
			render(
				withProv(
					<HeaderItemDisplay column={gridTestProps.columns[0]} componentRef={ref}>
						things
					</HeaderItemDisplay>
				)
			);
		});
		const el = screen.getByTestId('header__item__display');
		expect(el.classList.contains('datagrid__header__desc')).toBeFalsy();
		expect(el.classList.contains('datagrid__header__asc')).toBeFalsy();
	});

	it('Fires dispatch with relevant field when clicked', async () => {
		const dispatchSpy = jest.fn();

		jest.spyOn(DataGridContext, 'useDataGridContext').mockImplementation(() => [{} as any, dispatchSpy]);
		const ref: React.LegacyRef<HTMLDivElement> = { current: null };
		await act(async () => {
			render(
				withProv(
					<HeaderItemDisplay column={gridTestProps.columns[0]} componentRef={ref}>
						things
					</HeaderItemDisplay>
				)
			);
		});

		const el = screen.getByTestId('header__item__display');
		fireEvent.click(el);
		expect(dispatchSpy).toBeCalledTimes(1);
		expect(dispatchSpy).toBeCalledWith({ type: 'sortKey', payload: 'name' });
	});
});
