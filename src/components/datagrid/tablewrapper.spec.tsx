import { render, screen, fireEvent, cleanup, act } from '../../test-utils';
import { TableWrapper } from './tablewrapper';
import { gridTestProps, withProv } from './tests/datagridcontext';
import * as React from 'react';
import userEvent from '@testing-library/user-event';

describe('<TableWrapper />', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.restoreAllMocks();
		cleanup();
		jest.resetModules();
	});

	it('Renders', () => {
		render(withProv(<TableWrapper {...gridTestProps} />));
		expect(screen.getAllByTestId('table__wrapper').length).toBe(1);
	});

	it('Renders no columns when columns are undefined', async () => {
		render(withProv(<TableWrapper {...gridTestProps} columns={undefined} />));
		expect(screen.getAllByTestId('table__wrapper').length).toBe(1);
		expect(screen.queryAllByTestId('datagrid__resize__header').length).toBe(0);
	});

	it('Renders with empty data (TS null case)', async () => {
		await act(async () => {
			render(withProv(<TableWrapper rows={[]} columns={[]} getRowKey={(r) => ''} />));
		});
		expect(screen.getAllByTestId('table__wrapper').length).toBe(1);
	});

	it('Ignores bad key values (TS case)', async () => {
		await act(async () => {
			render(withProv(<TableWrapper {...gridTestProps} />));
		});
		expect(screen.getAllByTestId('table__wrapper').length).toBe(1);
	});

	it('Renders 1 header item per active column', async () => {
		let data = gridTestProps;
		let rerender: any;
		await act(async () => {
			rerender = render(withProv(<TableWrapper {...data} />)).rerender;
		});

		expect(screen.getAllByTestId('datagrid__resize__header').length).toBe(2);
		data = { ...data, columns: [...data.columns] };
		data.columns[0] = { ...data.columns[0], active: false };
		await act(async () => {
			rerender(withProv(<TableWrapper {...data} />));
		});

		expect(screen.getAllByTestId('datagrid__resize__header').length).toBe(1);
	});

	it('Renders 1 row per provided row', async () => {
		let data = gridTestProps;
		await act(async () => {
			render(withProv(<TableWrapper {...data} />));
		});

		const rows = screen.getAllByTestId('table__row');
		expect(rows.length).toBe(3);
	});

	it('Applies table cell wrapping on relevant columns', async () => {
		let data = gridTestProps;
		await act(async () => {
			render(withProv(<TableWrapper {...data} />));
		});

		const row = screen.getAllByTestId('table__row')[0];
		const cells = row.querySelectorAll('td');
		expect(cells[0]).toHaveClass('cell__wrap');
		expect(cells[1]).not.toHaveClass('cell__wrap');
	});

	it('Applies table cell wrapping on all columns', async () => {
		let data = { ...gridTestProps };
		data.columns = data.columns.map((c) => ({ ...c, wrap: undefined })) as any;

		await act(async () => {
			render(withProv(<TableWrapper {...data} wrapCells />));
		});

		const cells = document.querySelectorAll('td');
		cells.forEach((c) => expect(c).toHaveClass('cell__wrap'));
	});

	it('Matches Header scrollLeft position to table scrollLeft position', async () => {
		let data = gridTestProps;
		await act(async () => {
			render(withProv(<TableWrapper {...data} />));
		});

		const header = screen.getByTestId('datagrid__header');
		const table = screen.getByTestId('datagrid__table');
		const scrollSpy = jest.spyOn(table, 'scrollLeft', 'get').mockImplementation(() => 20);

		let rafCb: FrameRequestCallback = () => {};
		const rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
			rafCb = cb;
			return 0;
		});
		scrollSpy.mockImplementation(() => 20);
		expect(header.scrollLeft).toBe(0);
		fireEvent.scroll(table, { scrollLeft: 20 });
		expect(header.scrollLeft).toBe(0);
		rafSpy.mockReset();
		scrollSpy.mockImplementation(() => 40);
		fireEvent.scroll(table, { scrollLeft: 40 });
		rafCb(16);
		expect(header.scrollLeft).toBe(40);
	});

	//NOTE: row highlighting handled by css hover
	it('Does not highlight columns when tbody is entered but not a cell', async () => {
		let data = gridTestProps;
		await act(async () => {
			render(withProv(<TableWrapper {...data} />));
		});

		const el = screen.getByTestId('table__wrapper');
		const body = el.querySelector('tbody');
		const rows = screen.getAllByTestId('table__row');
		const cells = rows[1].querySelectorAll('td');
		const cols = el.querySelectorAll('col');
		const headerCells = screen.getAllByTestId('header__item__display');

		if (body) {
			fireEvent.mouseOver(body);
		}

		headerCells.forEach((c) => expect(c.classList.contains('datagrid__selected__col')).toBeFalsy());
		cols.forEach((c) => expect(c.classList.contains('datagrid__selected__col')).toBeFalsy());

		if (body) {
			fireEvent.mouseLeave(body);
		}

		headerCells.forEach((c) => expect(c.classList.contains('datagrid__selected__col')).toBeFalsy());
		cols.forEach((c) => expect(c.classList.contains('datagrid__selected__col')).toBeFalsy());
	});

	it('Highlights the proper column as mouse is moved inside table', async () => {
		let data = gridTestProps;
		await act(async () => {
			render(withProv(<TableWrapper {...data} />));
		});
		const el = screen.getByTestId('table__wrapper');
		const body = el.querySelector('tbody');
		const rows = screen.getAllByTestId('table__row');
		const cells = rows[1].querySelectorAll('td');
		const cols = el.querySelectorAll('col');
		const headerCells = screen.getAllByTestId('header__item__display');

		if (cells.length) {
			fireEvent.mouseOver(cells[0]);
		}

		headerCells.forEach((c, i) => expect(c.classList.contains('datagrid__selected__col')).toBe(i === 0));
		cols.forEach((c, i) => expect(c.classList.contains('datagrid__selected__col')).toBe(i === 0));

		if (cells.length) {
			fireEvent.mouseOver(cells[1]);
		}

		headerCells.forEach((c, i) => expect(c.classList.contains('datagrid__selected__col')).toBe(i === 1));
		cols.forEach((c, i) => expect(c.classList.contains('datagrid__selected__col')).toBe(i === 1));
	});

	it('Removes column highlighting when mouse leaves body', async () => {
		let data = gridTestProps;
		await act(async () => {
			render(withProv(<TableWrapper {...data} />));
		});
		const el = screen.getByTestId('table__wrapper');
		const body = el.querySelector('tbody');
		const rows = screen.getAllByTestId('table__row');
		const cells = rows[1].querySelectorAll('td');
		const cols = el.querySelectorAll('col');
		const headerCells = screen.getAllByTestId('header__item__display');

		if (cells.length) {
			fireEvent.mouseOver(cells[1]);
		}

		headerCells.forEach((c, i) => expect(c.classList.contains('datagrid__selected__col')).toBe(i === 1));
		cols.forEach((c, i) => expect(c.classList.contains('datagrid__selected__col')).toBe(i === 1));

		if (body) {
			fireEvent.mouseLeave(body);
		}
		headerCells.forEach((c) => expect(c.classList.contains('datagrid__selected__col')).toBeFalsy());
		cols.forEach((c) => expect(c.classList.contains('datagrid__selected__col')).toBeFalsy());
	});

	it('Adjusts proper col component width when header cell is resized', async () => {
		let data = gridTestProps;
		await act(async () => {
			render(withProv(<TableWrapper {...data} />));
		});
		const el = screen.getByTestId('table__wrapper');
		const cols = el.querySelectorAll('col');
		const headerResize = screen.getAllByTestId('datagrid__resize__header')[0];
		const handle = headerResize.querySelector('.datagrid__header__handle');

		let rafCb: FrameRequestCallback = () => {};
		const rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
			rafCb = cb;
			return 0;
		});

		jest.spyOn(headerResize, 'offsetWidth', 'get').mockImplementation(() => 20);
		if (handle) {
			fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 });
			fireEvent.mouseMove(handle, { clientX: 20, clientY: 0 });
		}
		expect(cols[0].style.width).toBe('1px');
		jest.spyOn(headerResize, 'offsetWidth', 'get').mockImplementation(() => 40);
		if (handle) {
			fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 });
			fireEvent.mouseMove(handle, { clientX: 40, clientY: 0 });
		}
		expect(cols[0].style.width).toBe('1px');
		rafCb(16);
		expect(cols[0].style.width).toBe('41px');
	});

	it('Maintains scroll position as headers are resizing', async () => {
		let data = gridTestProps;
		await act(async () => {
			render(withProv(<TableWrapper {...data} />));
		});
		const header = screen.getByTestId('datagrid__header');
		const table = screen.getByTestId('datagrid__table');
		const scrollSpy = jest.spyOn(table, 'scrollLeft', 'get').mockImplementation(() => 20);
		const headerResize = screen.getAllByTestId('datagrid__resize__header')[0];
		const handle = headerResize.querySelector('.datagrid__header__handle');

		jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
			cb(16);
			return 0;
		});

		scrollSpy.mockImplementationOnce(() => 20);
		expect(header.scrollLeft).toBe(0);
		fireEvent.scroll(table, { scrollLeft: 20 });
		expect(header.scrollLeft).toBe(20);
		expect(table.scrollLeft).toBe(20);

		jest.spyOn(headerResize, 'offsetWidth', 'get').mockImplementation(() => 40);
		if (handle) {
			fireEvent.mouseDown(handle, { clientX: 0, clientY: 0 });
			fireEvent.mouseMove(handle, { clientX: 40, clientY: 0 });
		}

		expect(header.scrollLeft).toBe(20);
		expect(table.scrollLeft).toBe(20);
	});

	it('Dispatches cell clicks', async () => {
		const onCellClick = jest.fn();
		let data = gridTestProps;
		await act(async () => {
			render(withProv(<TableWrapper {...data} onCellClick={onCellClick} />));
		});
		const cell = screen.getByText('b');
		await act(async () => {
			userEvent.click(cell);
		});
		const args = onCellClick.mock.calls[0];
		expect(args[0]).toEqual(data.rows[1]);
		expect(args[1]).toBe(data.columns[0].key);
	});

	/**
	 * Test is checking when the row.find function is called when not necessary to avoid unnecessary loops.
	 */
	it('Ignores cell clicks without a callback', async () => {
		const getRowKey = jest.fn().mockImplementation((r) => r.key);
		let data = gridTestProps;
		await act(async () => {
			render(withProv(<TableWrapper {...data} getRowKey={getRowKey} />));
		});
		const cell = screen.getByText('b');
		const count = getRowKey.mock.calls.length;
		await act(async () => {
			userEvent.click(cell);
		});
		expect(getRowKey).toHaveBeenCalledTimes(count);
	});
});
