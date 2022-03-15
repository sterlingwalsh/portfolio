import { cleanup, render, screen } from '../../../test-utils';
import { DropdownItem } from './dropdownitem';

describe('<DropdownItem />', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(cleanup);

	it('Renders', async () => {
		render(<DropdownItem className="test-class">Content</DropdownItem>);
		const component = screen.getByTestId('dropdown-item');
		expect(component).toBeInTheDocument();
		expect(component).toHaveClass('test-class');
		expect(screen.getByText('Content')).toBeInTheDocument();
	});

	it('Displays icon and end adornment', async () => {
		render(
			<DropdownItem icon="123" endAdornment="456">
				Content
			</DropdownItem>
		);
		expect(screen.getByText('123')).toBeInTheDocument();
		expect(screen.getByText('456')).toBeInTheDocument();
	});
});
