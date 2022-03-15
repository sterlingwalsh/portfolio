import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { act, render, screen } from '../../test-utils';
import { inputText } from '../../tests/components/styledinputtest';
import { ConfirmProvider, useConfirm } from './confirmprovider';

const TestComponent = (props: any) => {
	const [input, setInput] = useState('');
	const confirm = useConfirm();

	const click = () => {
		confirm({
			variant: 'input',
			onSubmit: (evt, val) => setInput(val),
			actions: [
				{
					type: 'submit',
					text: 'OK',
				},
				{
					text: 'Other',
					onClick: (evt, val) => setInput(val),
				},
				{
					text: 'Cancel',
					close: true,
				},
			],
			...props,
		});
	};
	return (
		<>
			<button data-testid="testbutton" onClick={click} />
			<div data-testid="inputOutput">{input}</div>
		</>
	);
};

describe('<ConfirmProvider />', () => {
	it('Renders children', async () => {
		render(
			<ConfirmProvider>
				<TestComponent />
			</ConfirmProvider>
		);
		expect(screen.getByTestId('testbutton')).toBeInTheDocument();
		expect(screen.queryByTestId('confirm-dialog-modal')).not.toBeInTheDocument();
	});

	it('Opens the modal', async () => {
		render(
			<ConfirmProvider>
				<TestComponent />
			</ConfirmProvider>
		);
		const button = screen.getByTestId('testbutton');
		await act(async () => {
			userEvent.click(button);
		});
		expect(screen.queryByTestId('confirm-dialog-modal')).toBeInTheDocument();
	});

	it('Returns input on submit', async () => {
		render(
			<ConfirmProvider>
				<TestComponent />
			</ConfirmProvider>
		);
		const button = screen.getByTestId('testbutton');
		await act(async () => {
			userEvent.click(button);
		});
		await inputText('confirm-input', 'test text');
		await act(async () => {
			userEvent.click(screen.getByText('OK'));
		});
		expect(screen.getByTestId('inputOutput')).toHaveTextContent('test text');
	});

	it('Returns input on other button', async () => {
		render(
			<ConfirmProvider>
				<TestComponent />
			</ConfirmProvider>
		);
		const button = screen.getByTestId('testbutton');
		await act(async () => {
			userEvent.click(button);
		});
		await inputText('confirm-input', 'test text');
		await act(async () => {
			userEvent.click(screen.getByText('Other'));
		});
		expect(screen.getByTestId('inputOutput')).toHaveTextContent('test text');
	});

	it('Uses a default confirm value', async () => {
		render(
			<ConfirmProvider>
				<TestComponent variant="typeConfirm" />
			</ConfirmProvider>
		);
		const button = screen.getByTestId('testbutton');
		await act(async () => {
			userEvent.click(button);
		});
		expect(screen.getByText("Type 'Confirm' to proceed")).toBeInTheDocument();
	});
});
