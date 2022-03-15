import { cleanup } from '../../../test-utils';
import { saveCSV } from './savecsv';

const data = {
	headers: ['title1', 'title2'],
	rowData: [
		['c', 1],
		['b', 2],
		['a', 3],
		['a#', 4],
	],
};

describe('saveCSV', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
		jest.restoreAllMocks();
	});
	it('Exports data', () => {
		const a = document.createElement('a');
		const clickSpy = jest.fn();
		const removeSpy = jest.fn();
		a.click = clickSpy;
		a.remove = removeSpy;
		jest.spyOn(document, 'createElement').mockReturnValueOnce(a);
		saveCSV(data);

		expect(a.download.startsWith('Risk Architecture')).toBeTruthy();

		expect(clickSpy).toHaveBeenCalledTimes(1);
		expect(removeSpy).toHaveBeenCalledTimes(1);
	});

	it('Uses provided file name', () => {
		const a = document.createElement('a');
		const clickSpy = jest.fn();
		const removeSpy = jest.fn();
		a.click = clickSpy;
		a.remove = removeSpy;
		jest.spyOn(document, 'createElement').mockReturnValueOnce(a);
		saveCSV(data, 'testname');

		expect(a.download.startsWith('testname')).toBeTruthy();
	});
});
