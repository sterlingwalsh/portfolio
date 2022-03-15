import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { act, render, screen } from '../../test-utils';
import { StyledInput, StyledInputProps } from './styledinput';
import { inputText } from '../../tests/components/styledinputtest';

interface TestData {
	test: string;
	input?: string;
}

jest.mock('../help/info/styledinfo', () => {
	return {
		StyledInfo: (props: any) => (
			<div data-testid="input-help">
				<div data-testid="help-title">{props.title}</div>
				<div>{props.content}</div>
			</div>
		),
	};
});

const TestComponent: React.FC<StyledInputProps & { submit: (data: any) => void }> = ({ submit, ...props }) => {
	const { control, handleSubmit } = useForm<TestData>({
		defaultValues: {
			test: '',
			input: '',
		},
	});
	return (
		<form onSubmit={submit && handleSubmit(submit)}>
			<button data-testid="submit" type="submit" />
			<StyledInput data-testid="check" {...props} control={control} />
		</form>
	);
};

describe('<StyledInupt />', () => {
	it('Renders', () => {
		render(<StyledInput data-testid="test" className="testclass" />);
		const el = screen.queryByTestId('test');
		expect(el).toBeInTheDocument();
		expect(el).toHaveClass('testclass');
	});

	it('Renders help text', async () => {
		render(<StyledInput data-testid="test" helpLabel="helpLabel" helpText="helpText" />);
		expect(screen.queryByTestId('input-help')).toBeInTheDocument();
		expect(screen.getByText('helpLabel')).toBeInTheDocument();
		expect(screen.getByText('helpText')).toBeInTheDocument();
	});

	it('Renders help text defaulting to provided input label', async () => {
		render(<StyledInput data-testid="test" label="helpLabel" helpText="helpText" />);
		expect(screen.queryByTestId('input-help')).toBeInTheDocument();
		expect(screen.getByTestId('help-title')).toHaveTextContent('helpLabel');
		expect(screen.getByText('helpText')).toBeInTheDocument();
	});

	it('Renders help text without label', async () => {
		render(<StyledInput data-testid="test" helpText="helpText" />);
		expect(screen.queryByTestId('input-help')).toBeInTheDocument();
		expect(screen.getByTestId('help-title')).toHaveTextContent('');
		expect(screen.getByText('helpText')).toBeInTheDocument();
	});

	it('Applies disabled styles', () => {
		render(<StyledInput data-testid="test" disabled />);
		const el = screen.queryByTestId('test');
		expect(el).toBeInTheDocument();
		expect(el).toHaveClass('input__disabled');
	});

	it('Provides a default name to a controller', async () => {
		const submit = jest.fn();
		render(<TestComponent data-testid="test" label="label" helpText="helpText" submit={submit} />);
		const comp = screen.getByTestId('test');
		expect(screen.queryByTestId('input-help')).toBeInTheDocument();

		await inputText(comp, '123');

		const button = screen.getByTestId('submit');

		await act(async () => {
			userEvent.click(button);
		});

		expect(submit.mock.calls[0][0].input).toBe('123');
	});

	it('Provides overrides the default name to a controller', async () => {
		const submit = jest.fn();
		render(<TestComponent name="test" data-testid="test" label="label" helpText="helpText" submit={submit} />);
		const comp = screen.getByTestId('test');
		expect(screen.queryByTestId('input-help')).toBeInTheDocument();

		await inputText(comp, '123');

		const button = screen.getByTestId('submit');

		await act(async () => {
			userEvent.click(button);
		});

		expect(submit.mock.calls[0][0].test).toBe('123');
	});

	it('Modifies spacing when there is no label', async () => {
		render(<StyledInput name="test" data-testid="test" />);
		const comp = screen.getByTestId('test');
		expect(comp).toHaveClass('style__input__no__label');
	});

	it('Displays a search icon', async () => {
		render(<StyledInput name="test" data-testid="test" search />);
		const search = screen.getByText('search');
		expect(search).toBeInTheDocument();
	});
});
