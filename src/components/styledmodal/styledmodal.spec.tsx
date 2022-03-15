import { render, screen } from '../../../test-utils';
import { ModalBody, ModalFooter, ModalHeader, StyledModal } from './styledmodal';

describe('<StyledModal />', () => {
	it('Renders', async () => {
		render(
			<StyledModal open={true}>
				<ModalHeader text="title text">Header</ModalHeader>
				<ModalBody>Body</ModalBody>
				<ModalFooter>Footer</ModalFooter>
			</StyledModal>
		);
		expect(screen.queryByText('title text')).toBeInTheDocument();
		expect(screen.queryByText('Header')).toBeInTheDocument();
		expect(screen.queryByText('Body')).toBeInTheDocument();
		expect(screen.queryByText('Footer')).toBeInTheDocument();
	});

	it('Passes classNames to the components', async () => {
		render(
			<StyledModal className="modalClass" open={true}>
				<ModalHeader text="title text" className="headerClass">
					Header
				</ModalHeader>
				<ModalBody className="bodyClass" noPadding noScroll>
					Body
				</ModalBody>
				<ModalFooter className="footerClass">Footer</ModalFooter>
			</StyledModal>
		);
		expect(document.querySelector('.modalClass')).toBeInTheDocument();
		expect(document.querySelector('.headerClass')).toBeInTheDocument();
		const body = document.querySelector('.bodyClass');
		expect(body).toBeInTheDocument();
		expect(body).toHaveClass('nopadding');
		expect(document.querySelector('.modal__body__scroll__wrapper')).toHaveClass('noScroll');
		expect(document.querySelector('.footerClass')).toBeInTheDocument();
	});
});
