import { DataGridExportState } from './datagridexport';
import { toCSV } from './tocsv';

describe('toCSV', () => {
	it('Creates CSV data with objects', () => {
		const state: DataGridExportState = {
			rows: [
				{ key: 1, name: 'c' },
				{ key: 2, name: 'b' },
				{ key: 3, name: 'a' },
			],
			columns: [
				{ title: 'title1', key: 'name', active: true },
				{ title: 'title2', key: 'key', active: true },
			],
			sortKey: undefined,
			sortDir: 1,
			defaultGetValue: undefined,
		};
		const d = toCSV(state);
		expect(d).toEqual({
			headers: ['title1', 'title2'],
			rowData: [
				['"c"', '"1"'],
				['"b"', '"2"'],
				['"a"', '"3"'],
			],
		});
	});
	it('Hides Inactive Rows', () => {
		const state: DataGridExportState = {
			rows: [
				{ key: 1, name: 'c' },
				{ key: 2, name: 'b' },
				{ key: 3, name: 'a' },
			],
			columns: [
				{ title: 'title1', key: 'name', active: false },
				{ title: 'title2', key: 'key', active: true },
			],
			sortKey: undefined,
			sortDir: 1,
			defaultGetValue: undefined,
		};
		const d = toCSV(state);
		expect(d).toEqual({
			headers: ['title2'],
			rowData: [['"1"'], ['"2"'], ['"3"']],
		});
	});
	it('Overrides inactive columns when requested', () => {
		const state: DataGridExportState = {
			rows: [
				{ key: 1, name: 'c' },
				{ key: 2, name: 'b' },
				{ key: 3, name: 'a' },
			],
			columns: [
				{ title: 'title1', key: 'name', active: true },
				{ title: 'title2', key: 'key', active: true },
			],
			sortKey: undefined,
			sortDir: 1,
			defaultGetValue: undefined,
		};
		const d = toCSV(state, { allColumns: true });
		expect(d).toEqual({
			headers: ['title1', 'title2'],
			rowData: [
				['"c"', '"1"'],
				['"b"', '"2"'],
				['"a"', '"3"'],
			],
		});
	});

	it('Exports keys as headers when names are missing', () => {
		const state: DataGridExportState = {
			rows: [
				{ key: 1, name: 'c' },
				{ key: 2, name: 'b' },
				{ key: 3, name: 'a' },
			],
			columns: [
				{ key: 'name', active: false },
				{ key: 'key', active: true },
			],
			sortKey: undefined,
			sortDir: 1,
			defaultGetValue: undefined,
		};
		const d = toCSV(state, { allColumns: true });
		expect(d).toEqual({
			headers: ['name', 'key'],
			rowData: [
				['"c"', '"1"'],
				['"b"', '"2"'],
				['"a"', '"3"'],
			],
		});
	});
});
