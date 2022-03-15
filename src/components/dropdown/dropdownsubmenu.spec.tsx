import { ClickAwayListenerProps, PopperProps } from '@material-ui/core';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { cleanup, render, screen } from '../../../test-utils';
import { DropdownSubmenu } from './dropdownsubmenu';

jest.mock('@material-ui/core', () => {
	const original = jest.requireActual('@material-ui/core'); // Step 2.
	return {
		...original,
		ClickAwayListener: (props: ClickAwayListenerProps) => {
			return (
				<>
					<button onClick={props.onClickAway as any}>clickaway</button>
					{props.children}
				</>
			);
		},
		Popper: (props: PopperProps) => {
			return props.open ? <div data-testid="mock-popper">{(props.children as any)({})}</div> : null;
		},
		Grow: (props: any) => props.children,
	};
});
describe('<DropdownSubMenu />', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(cleanup);

	it('Renders', async () => {
		render(<DropdownSubmenu label="123" />);
		const menuItem = screen.getByTestId('root');
		expect(menuItem).toBeInTheDocument();
		expect(screen.getByText('123')).toBeInTheDocument();

		await act(async () => {
			userEvent.click(menuItem);
		});

		expect(screen.getByTestId('submenu')).toBeInTheDocument();

		await act(async () => {
			userEvent.click(screen.getByText('clickaway'));
		});

		expect(screen.queryByTestId('submenu')).not.toBeInTheDocument();
	});
});
