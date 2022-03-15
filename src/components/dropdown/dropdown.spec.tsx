import userEvent from '@testing-library/user-event';
import React from 'react';
import { act, render, screen, waitForElementToBeRemoved } from '../../../test-utils';
import { Dropdown } from './dropdown';
import { DropdownItem } from './dropdownitem';

describe('<Dropdown />', () => {
	it('Renders itself and options', async () => {
		render(
			<Dropdown label="drop" helpText={{ title: 'title', content: 'content' }}>
				<DropdownItem>item1</DropdownItem>
				<DropdownItem className="item2">item2</DropdownItem>
			</Dropdown>
		);
		const button = await screen.findByText('drop');
		expect(button).toBeInTheDocument();
		await act(async () => {
			if (button) {
				userEvent.click(button);
			}
		});
		new Promise((r) => setTimeout(r, 500)); //wait for menu to open
		const item1 = await screen.findByText('item1');
		const item2 = await screen.findByText('item2');
		expect(item1).toBeInTheDocument();
		expect(item2).toBeInTheDocument();
		expect(document.querySelector('.item2')).toBeInTheDocument();

		await act(async () => {
			userEvent.click(document.body);
		});
		await waitForElementToBeRemoved(item1);
		expect(screen.queryByText('item1')).toBeFalsy();
		expect(screen.queryByText('item2')).toBeFalsy();
	});

	it('Passes classes', async () => {
		render(
			<Dropdown label="drop" className="propsclass">
				<DropdownItem>item1</DropdownItem>
				<DropdownItem className="item2">item2</DropdownItem>
			</Dropdown>
		);
		const root = screen.getByTestId('root');
		const trigger = screen.getByTestId('trigger');
		expect(root).toBeInTheDocument();
		expect(root).toHaveClass('hover__underline');
		expect(root).not.toHaveClass('dropdown__icon');
		expect(trigger).toHaveClass('hover__underline__target');
	});

	it('Applies classes from options', async () => {
		render(
			<Dropdown label="drop" className="propsclass" hideArrow hideUnderline>
				<DropdownItem>item1</DropdownItem>
				<DropdownItem className="item2">item2</DropdownItem>
			</Dropdown>
		);
		const root = screen.getByTestId('root');
		const trigger = screen.getByTestId('trigger');
		expect(root).toBeInTheDocument();
		expect(root).not.toHaveClass('hover__underline');
		expect(trigger).not.toHaveClass('hover__underline__target');
	});

	it('Applies classes from icon variant', async () => {
		render(
			<Dropdown label="drop" className="propsclass" variant="icon">
				<DropdownItem>item1</DropdownItem>
				<DropdownItem className="item2">item2</DropdownItem>
			</Dropdown>
		);
		const root = screen.getByTestId('root');
		const trigger = screen.getByTestId('trigger');
		expect(root).toBeInTheDocument();
		expect(root).not.toHaveClass('hover__underline');
		expect(root).toHaveClass('dropdown__icon');
		expect(trigger).not.toHaveClass('hover__underline__target');
	});
});
