import { act, cleanup, render, screen } from '../../test-utils';
import { StyledButton } from './styledbutton';
import * as helpers from '../../helpers/utils';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';

describe('<StyledButton />', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
		jest.resetModules();
	});

	it('Renders', async () => {
		await act(async () => {
			render(<StyledButton />);
		});
		expect(screen.queryByRole('button')).toBeTruthy();
	});

	it('Passes wrapper class', async () => {
		await act(async () => {
			render(<StyledButton wrapperClass="wrapperTestClass" />);
		});
		expect(screen.getByTestId('styled-button-wrapper')).toHaveClass('wrapperTestClass');
	});

	it('Stops click propagation when requested', async () => {
		const killMock = jest.fn();
		jest.spyOn(helpers, 'killEvt').mockImplementation(killMock);

		let rerender: any;
		await act(async () => {
			rerender = render(<StyledButton stopClick />).rerender;
		});
		const button = screen.queryByRole('button');

		await act(async () => {
			if (button) userEvent.click(button);
		});
		expect(killMock).toBeCalledTimes(1);

		await act(async () => {
			rerender?.(<StyledButton />);
		});

		await act(async () => {
			if (button) userEvent.click(button);
		});
		expect(killMock).toBeCalledTimes(1);
	});

	it('Stops mouseDown propagation when requested', async () => {
		const killMock = jest.fn();
		jest.spyOn(helpers, 'killEvt').mockImplementation(killMock);

		let rerender: any;
		await act(async () => {
			rerender = render(<StyledButton stopMouseDown />).rerender;
		});
		const button = screen.queryByRole('button');

		await act(async () => {
			if (button) fireEvent.mouseDown(button);
		});
		expect(killMock).toBeCalledTimes(1);

		await act(async () => {
			rerender?.(<StyledButton />);
		});

		await act(async () => {
			if (button) fireEvent.mouseDown(button);
		});
		expect(killMock).toBeCalledTimes(1);

		const mouseDown = jest.fn();
		await act(async () => {
			rerender?.(<StyledButton onMouseDown={mouseDown} stopMouseDown />);
		});
		await act(async () => {
			if (button) fireEvent.mouseDown(button);
		});
		expect(mouseDown).toBeCalledTimes(1);
		expect(killMock).toBeCalledTimes(2);
	});

	it('Passes color into css class', async () => {
		let rerender: any;
		await act(async () => {
			rerender = render(<StyledButton />).rerender;
		});
		expect(document.querySelector('.button__action')).toBeFalsy();
		expect(document.querySelector('.button__danger')).toBeFalsy();

		await act(async () => {
			rerender?.(<StyledButton color="action" />);
		});
		expect(document.querySelector('.button__action')).toBeTruthy();
		expect(document.querySelector('.button__danger')).toBeFalsy();

		await act(async () => {
			rerender?.(<StyledButton color="danger" />);
		});
		expect(document.querySelector('.button__action')).toBeFalsy();
		expect(document.querySelector('.button__danger')).toBeTruthy();
	});

	it('Handles double click', async () => {
		const click = jest.fn();
		const dbl = jest.fn();
		await act(async () => {
			render(<StyledButton onClick={click} onDoubleClick={dbl} />);
		});
		const button = screen.queryByRole('button');

		await act(async () => {
			if (button) userEvent.click(button);
			await new Promise((r) => setTimeout(r, 300)); //wait for double click watcher
		});

		expect(click).toBeCalledTimes(1);
		expect(dbl).toBeCalledTimes(0);

		await act(async () => {
			if (button) userEvent.click(button);
			if (button) userEvent.click(button);
		});
		expect(click).toBeCalledTimes(1);
		expect(dbl).toBeCalledTimes(1);
	});

	it('Displays loading, disables button while loading', async () => {
		await act(async () => {
			render(<StyledButton loading />);
		});
		const button = screen.getByTestId('styled-button');
		expect(button).toHaveClass('button__disabled');
		expect(screen.queryByTestId('button__spinner')).toBeInTheDocument();
	});
});
