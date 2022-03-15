import userEvent from '@testing-library/user-event';
import { act, cleanup, render, screen } from '../../test-utils';
import { StyledAutocomplete, StyledAutocompleteProps } from './styledautocomplete';
import { getAutocompleteOptions, openAutocomplete, selectAutocompleteOption } from '../../tests/components/styledautocompletetest';

const options = ['alpha', 'beta', 'gamma'];

interface TestData {
    test: string;
    auto?: string;
}

jest.mock('react-virtuoso', () => ({
    Virtuoso: ({ data, itemContent, itemClassName, listClassName, ...props }: any) => <div {...(props as any)}>{data.map((d: any, i: any) => itemContent?.(i, d))}</div>,
}));

const TestComponent: React.FC<StyledAutocompleteProps<string, false, false, false> & { submit: (data: any) => void }> = ({ submit, ...props }) => {
    const { control, handleSubmit } = useForm<TestData>({
        defaultValues: {
            test: '',
            auto: '',
        },
    });
    return (
        <form onSubmit={submit && handleSubmit(submit)}>
            <button data-testid='submit' type='submit' />
            <StyledAutocomplete data-testid='test' {...props} control={control} />
        </form>
    );
};

const TestComponentMultiple: React.FC<StyledAutocompleteProps<string, true, false, false> & { submit: (data: any) => void }> = ({ submit, ...props }) => {
    const { control, handleSubmit } = useForm<{
        test: string[];
        auto?: string;
    }>({
        defaultValues: {
            test: ['alpha'],
            auto: '',
        },
    });
    return (
        <form onSubmit={submit && handleSubmit(submit)}>
            <button data-testid='submit' type='submit' />
            <StyledAutocomplete multiple data-testid='test' {...props} control={control} />
        </form>
    );
};

describe('<StyledAutocomplete/>', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
        jest.restoreAllMocks();
        jest.resetModules();
    });
    it('Renders', async () => {
        render(<StyledAutocomplete data-testid='test' options={options} />);
        const comp = screen.queryByTestId('test');
        expect(comp).toBeInTheDocument();
        expect(await getAutocompleteOptions(comp!)).toHaveLength(3);
    });

    it('Virtualizes long lists', async () => {
        render(<StyledAutocomplete data-testid='test' options={new Array(1000).fill(null).map((n, i) => i + '')} />);
        await openAutocomplete('test');
        expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    }, 100000);

    it('Renders with custom class', async () => {
        render(<StyledAutocomplete className={`facility-search-auto-complete`} data-testid='test' options={options} />);
        const comp = screen.queryByTestId('test');
        expect(comp).toBeInTheDocument();
        expect(comp).toHaveClass('facility-search-auto-complete');
        expect(await getAutocompleteOptions(comp!)).toHaveLength(3);
    }, 100000);

    // it('Limits displayed options', async () => {
    // 	render(<StyledAutocomplete data-testid="test" maxResults={25} options={new Array(100).fill(null).map((n, i) => i + '')} />);
    // 	const comp = screen.getByTestId('test');
    // 	expect(await getAutocompleteOptions(comp!)).toHaveLength(25);
    // });

    it('Provides a default name to the controller', async () => {
        const submit = jest.fn();
        render(<TestComponent submit={submit} options={options} />);
        const comp = screen.getByTestId('test');
        await selectAutocompleteOption(comp, 'beta');
        const button = screen.getByTestId('submit');
        await act(async () => {
            userEvent.click(button);
        });
        await new Promise((r) => setTimeout(r, 1000));
        expect(submit.mock.calls[0][0].auto).toBe('beta');
    });

    it('Overrides the default name to the controller', async () => {
        const submit = jest.fn();
        render(<TestComponent submit={submit} options={options} name='test' />);
        const comp = screen.getByTestId('test');
        await selectAutocompleteOption(comp, 'beta');
        const button = screen.getByTestId('submit');
        await act(async () => {
            userEvent.click(button);
        });
        await new Promise((r) => setTimeout(r, 1000));
        expect(submit.mock.calls[0][0].test).toBe('beta');
    });

    it('Overrides the default name to the controller multiple', async () => {
        const submit = jest.fn();
        render(<TestComponentMultiple submit={submit} options={options} name='test' />);
        const comp = screen.getByTestId('test');
        await selectAutocompleteOption(comp, 'beta');
        const button = screen.getByTestId('submit');
        await act(async () => {
            userEvent.click(button);
        });
        await new Promise((r) => setTimeout(r, 1000));
        expect(submit.mock.calls[0][0].test).toEqual(['alpha', 'beta']);
    });

    it('Returns a stringified option when provided with bad labeling', async () => {
        const onChipClick = jest.fn();
        const opts = [
            { name: 'alpha', id: 1 },
            { name: 'beta', id: 2 },
            { name: 'gamma', id: 3 },
        ];
        render(<StyledAutocomplete data-testid='test' options={opts} multiple value={[opts[1]]} onChipClick={onChipClick} getOptionLabel={() => undefined as any} />);
        expect(screen.getByText(JSON.stringify(opts[1]))).toBeInTheDocument();
    });

    it('Adjusts data types when improperly provided with a single value', async () => {
        render(<StyledAutocomplete data-testid='test' options={options} multiple value={options[0] as any} />);
        expect(await screen.findByText(options[0])).toBeInTheDocument();
    });

    it('Returns the selected option onChipClick', async () => {
        const onChipClick = jest.fn();
        const opts = [
            { name: 'alpha', id: 1 },
            { name: 'beta', id: 2 },
            { name: 'gamma', id: 3 },
        ];
        render(<StyledAutocomplete data-testid='test' options={opts} multiple value={[opts[1]]} onChipClick={onChipClick} />);
        const chip = screen.getAllByTestId('autocomplete-chip')[0];
        await act(async () => {
            userEvent.click(chip);
        });
        const call = onChipClick.mock.calls[0];
        expect(call[1]).toBe(opts[1]);
        expect(call[2]).toBe(1);
        expect(call[3]).toBe(0);
    });
});
