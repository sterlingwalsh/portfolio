import * as React from 'react';
import { cleanup, render, screen } from '../../test-utils';
import { appContextWrapper } from '../../tests/helper/appcontext';
import { DataGridProvider } from './datagridcontext';

import * as DataGridContext from './datagridcontext';
import { act } from '@testing-library/react';
import { getFeatureSet, getFields, getLayers } from '../../tests/data/layer';
import Extent from '@arcgis/core/geometry/Extent';
import * as WatchUtils from '@arcgis/core/core/watchUtils';
import { handleSort } from './utility/handlesort';

const rows = getFields(5);
const columns = [
	{
		key: 'name',
	},
	{
		key: 'alias',
	},
	{
		key: 'type',
	},
];

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
			render(
				<DataGridProvider<any> rows={rows} columns={columns} getRowKey={(r) => r.name}>
					<div data-testid="testdiv"></div>
				</DataGridProvider>
			);
		});
		expect(screen.getAllByTestId('testdiv').length).toBe(1);
	});

	// it('Stores provided mapViews in state', async () => {
	// 	const { layer, appState, features } = testApp();
	// 	const reducerSpy = jest.spyOn(React, 'useReducer');

	// 	const dispatchSpy = jest.fn();
	// 	reducerSpy.mockImplementation(() => [{}, dispatchSpy]);

	// 	await act(async () => {
	// 		render(
	// 			appContextWrapper(
	// 				<DataGridProvider layer={layer} mapView={appState.mapView}>
	// 					<div data-testid="testdiv"></div>
	// 				</DataGridProvider>,
	// 				appState
	// 			)
	// 		);
	// 	});
	// 	const mapCall = dispatchSpy.mock.calls.find((c) => c[0].type === 'mapView');
	// 	expect(mapCall).toBeTruthy();
	// 	expect(mapCall[0].payload).toBe(appState.mapView);
	// 	const layerCall = dispatchSpy.mock.calls.find((c) => c[0].type === 'layer');
	// 	expect(layerCall[0].payload).toBe(layer);
	// });

	// it('Queries and updates features when provided with a layer', async () => {
	// 	const { layer, appState, features } = testApp();
	// 	const reducerSpy = jest.spyOn(React, 'useReducer');

	// 	const dispatchSpy = jest.fn();
	// 	let rerender: any;
	// 	reducerSpy.mockImplementation(() => [{ requiresRefresh: true }, dispatchSpy]);
	// 	await act(async () => {
	// 		rerender = render(
	// 			appContextWrapper(
	// 				<DataGridProvider>
	// 					<div data-testid="testdiv"></div>
	// 				</DataGridProvider>,
	// 				appState
	// 			)
	// 		).rerender;
	// 	});

	// 	let call = dispatchSpy.mock.calls.find((c) => c[0].type === 'features');
	// 	expect(call).toBeFalsy();

	// 	reducerSpy.mockImplementation(() => [{ requiresRefresh: false }, dispatchSpy]);
	// 	await act(async () => {
	// 		rerender(
	// 			appContextWrapper(
	// 				<DataGridProvider layer={layer}>
	// 					<div data-testid="testdiv"></div>
	// 				</DataGridProvider>,
	// 				appState
	// 			)
	// 		);
	// 	});

	// 	reducerSpy.mockImplementation(() => [{ layer, requiresRefresh: true }, dispatchSpy]);
	// 	await act(async () => {
	// 		rerender(
	// 			appContextWrapper(
	// 				<DataGridProvider layer={layer}>
	// 					<div data-testid="testdiv"></div>
	// 				</DataGridProvider>,
	// 				appState
	// 			)
	// 		);
	// 	});

	// 	call = dispatchSpy.mock.calls.find((c) => c[0].type === 'features');
	// 	expect(call).toBeTruthy();
	// 	expect(call[0].payload).toBe(features);
	// });

	// it('Displays loading', async () => {
	// 	await act(async () => {
	// 		render(
	// 			<DataGridProvider<__esri.Field> rows={rows} columns={columns} getRowKey={(r) => r.name} loading={true}>
	// 				<div data-testid="testdiv"></div>
	// 			</DataGridProvider>
	// 		);
	// 	});

	// 	expect(screen.getByTestId('datagrid-loading')).toBeInTheDocument();
	// });

	// it('Watches a provided mapView for changes and notifies when map doesnt match', async () => {
	// 	let watchCB = () => {};
	// 	jest.spyOn(WatchUtils, 'watch').mockImplementation((acc, prop, cb) => {
	// 		watchCB = cb as any;
	// 		return { remove: () => {} };
	// 	});

	// 	const { layer, appState, features } = testApp();
	// 	const reducerSpy = jest.spyOn(React, 'useReducer');

	// 	const mapView = { extent: new Extent() };

	// 	const dispatchSpy = jest.fn();
	// 	reducerSpy.mockImplementation(() => [{ layer, mapView, mapMatches: true }, dispatchSpy]);

	// 	let rerender: any;
	// 	await act(async () => {
	// 		rerender = render(
	// 			appContextWrapper(
	// 				<DataGridProvider>
	// 					<div data-testid="testdiv"></div>
	// 				</DataGridProvider>,
	// 				appState
	// 			)
	// 		).rerender;
	// 	});
	// 	watchCB();

	// 	expect(dispatchSpy.mock.calls.filter((c) => c[0].type === 'mapMatches').length).toBe(1);
	// 	// mock expected state change after first render
	// 	reducerSpy.mockImplementation(() => [{ layer, mapView, mapMatches: false }, dispatchSpy]);
	// 	await act(async () => {
	// 		rerender(
	// 			appContextWrapper(
	// 				<DataGridProvider>
	// 					<div data-testid="testdiv"></div>
	// 				</DataGridProvider>,
	// 				appState
	// 			)
	// 		);
	// 	});
	// 	watchCB();
	// 	expect(dispatchSpy.mock.calls.filter((c) => c[0].type === 'mapMatches').length).toBe(1);
	// });

	// it('Auto updates data when map changes if requested', async () => {
	// 	let watchCB = () => {};
	// 	jest.spyOn(WatchUtils, 'watch').mockImplementation((acc, prop, cb) => {
	// 		watchCB = cb as any;
	// 		return { remove: () => {} };
	// 	});

	// 	const { layer, appState } = testApp();
	// 	const reducerSpy = jest.spyOn(React, 'useReducer');

	// 	const mapView = { extent: new Extent() };

	// 	const dispatchSpy = jest.fn();
	// 	reducerSpy.mockImplementation(() => [{ layer, mapView, autoRefresh: true, syncMapExtent: true }, dispatchSpy]);
	// 	await act(async () => {
	// 		render(
	// 			appContextWrapper(
	// 				<DataGridProvider>
	// 					<div data-testid="testdiv"></div>
	// 				</DataGridProvider>,
	// 				appState
	// 			)
	// 		);
	// 	});
	// 	watchCB();
	// 	watchCB();
	// 	watchCB();
	// 	await new Promise((r) => setTimeout(r, 2500)); // wait for data update throttling
	// 	const fetch = dispatchSpy.mock.calls.filter((c) => c[0].type === 'features');
	// 	expect(fetch.length).toBe(1);
	// 	const mapCheck = dispatchSpy.mock.calls.find((c) => c[0].type === 'mapMatches');
	// 	expect(mapCheck).toBeTruthy();
	// });
});

describe('<DataGridContext /> reducer', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.restoreAllMocks();
		cleanup();
		jest.resetModules();
	});

	const initialState: DataGridContext.DataGridState<{ key: string; name: string }> = {
		rowsPerPage: 25,
		page: 0,
		sortDir: 1,
		columns: [
			{ key: 'name', active: true },
			{ key: 'key', active: true },
		],
		rows: [],
		getRowKey: (r) => r.key,
	};

	const newRows = [
		{
			key: '1',
			name: 'c',
		},
		{ key: '2', name: 'b' },
		{ key: '3', name: 'a' },
	];

	it('Simply sets the appropriate properties', () => {
		const init: any = { ...initialState };
		let newState;
		newState = DataGridContext.reducer(init, { type: 'rowsPerPage', payload: 123 });
		expect(newState.rowsPerPage).toBe(123);

		newState = DataGridContext.reducer(init, { type: 'page', payload: 456 });
		expect(newState.page).toBe(456);

		const c = [123, 456, 789];
		newState = DataGridContext.reducer(init, { type: 'columns', payload: c });
		expect(newState.columns).toBe(c);

		newState = DataGridContext.reducer(init, { type: 'loading', payload: true });
		expect(newState.loading).toBe(true);
	});

	// it('Toggles sort direction when the same field is requested as sort', () => {
	// 	const features = getFeatureSet(10);
	// 	const f = features.fields[2];
	// 	const init: DataGridContext.DataGridState = { ...initialState, sortField: f, features };
	// 	let newState = DataGridContext.reducer(init, { type: 'sortField', payload: f });
	// 	expect(newState.sortDir).toBe(-1);
	// 	newState = DataGridContext.reducer(newState, { type: 'sortField', payload: f });
	// 	expect(newState.sortDir).toBe(1);
	// });

	// it('Defaults sort direction if there was no previous field selected for sorting', () => {
	// 	const features = getFeatureSet(10);
	// 	const f = features.fields[2];
	// 	const init: DataGridContext.DataGridState = { ...initialState, sortDir: -1 };
	// 	const newState = DataGridContext.reducer(init, { type: 'sortField', payload: f });
	// 	expect(newState.sortDir).toBe(1);
	// });

	it('Activates and deactivates column active flag when column is toggled', () => {
		const init: any = { ...initialState };
		let newState;
		newState = DataGridContext.reducer(init, { type: 'toggleColumn', payload: 'name' });

		newState.columns.forEach((c) => {
			expect(c.active).toBe(c.key !== 'name');
		});
	});

	// it('Sets syncMapExtent and refreshes data', () => {
	// 	const init: DataGridContext.DataGridState = { ...initialState };
	// 	const newState = DataGridContext.reducer(init, { type: 'syncMapExtent', payload: true });
	// 	expect(newState.syncMapExtent).toBe(true);
	// 	expect(newState.requiresRefresh).toBe(true);
	// });

	// it('Disables autoRefresh when not syncing to map', () => {
	// 	const init: DataGridContext.DataGridState = { ...initialState };
	// 	const newState = DataGridContext.reducer(init, { type: 'syncMapExtent', payload: false });
	// 	expect(newState.syncMapExtent).toBe(false);
	// 	expect(newState.requiresRefresh).toBe(true);
	// 	expect(newState.autoRefresh).toBe(false);
	// });

	it('Sorts when new rows are set', () => {
		const init: any = { ...initialState, sortKey: 'key', sortDir: -1 };
		let newState: any;
		newState = DataGridContext.reducer(init, { type: 'rows', payload: newRows });
		expect(newState.sortedRows[0].key).toBe('3');
	});

	it('Sorts when sortDir is set', () => {
		const init: any = { ...initialState, sortKey: 'key', rows: newRows };
		let newState: any;
		newState = DataGridContext.reducer(init, { type: 'sortDir', payload: -1 });
		expect(newState.sortedRows[0].key).toBe('3');
	});

	it('Sorts when sortKey is set', () => {
		const init: any = { ...initialState, sortDir: -1, rows: newRows };
		let newState: any;
		newState = DataGridContext.reducer(init, { type: 'sortKey', payload: 'key' });
		expect(newState.sortedRows[0].key).toBe('3');
		newState = DataGridContext.reducer(init, { type: 'sortKey', payload: 'key' });
	});

	it('Flips the sort direction when the same column is sorted twice', () => {
		const init: any = { ...initialState, sortDir: -1, rows: newRows };
		let newState: any;
		newState = DataGridContext.reducer(init, { type: 'sortKey', payload: 'key' });
		expect(newState.sortedRows[0].key).toBe('3');
		newState = DataGridContext.reducer(newState, { type: 'sortKey', payload: 'key' });
		expect(newState.sortedRows[0].key).toBe('1');
		expect(newState.sortDir).toBe(1);
	});

	it('Passes unaltered state through on unknown action type', () => {
		const init: any = { ...initialState };

		const newState = DataGridContext.reducer(init, { type: '123' as any, payload: -1 });
		expect(newState).toBe(init);
	});
});

describe('Data Grid Sort handler', () => {
	const rs = [
		{
			withFunc: 1,
			withString: 'c',
		},
		{
			withFunc: 2,
			withString: 'b',
		},
		{
			withFunc: 3,
			withString: 'a',
		},
	];

	const cols = [
		{
			key: 'withFunc',
			sort: (a: any, b: any) => b.withFunc - a.withFunc,
		},
		{
			key: 'withString',
		},
	];
	it('Sorts using custom sort functions', () => {
		const sorted = handleSort({ rows: [...rs], columns: [...cols], sortDir: 1, sortKey: 'withFunc' } as any);
		expect((sorted[0] as any).withFunc).toBe(3);
	});

	it('Sorts based on strings', () => {
		const sorted = handleSort({ rows: [...rs], columns: [...cols], sortDir: 1, sortKey: 'withString' } as any);
		expect((sorted[0] as any).withString).toBe('a');
	});
});
