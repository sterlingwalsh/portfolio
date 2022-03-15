import userEvent from '@testing-library/user-event';
import { cleanup, render, screen, within, act } from '../../test-utils';
import { DashboardWidget } from '../../types/dashboard/widgets/_common';
import { getGroupWidget } from '../../tests/data/dashboard/widgets/containers/group';
import { getTabWidget } from '../../tests/data/dashboard/widgets/containers/tab';
import { getLineChartWidget } from '../../tests/data/dashboard/widgets/linechart';
import { getListWidget } from '../../tests/data/dashboard/widgets/list';
import { librarySections, WidgetItem, WidgetItemComponent, WidgetPicker, widgetsFromOverride, widgetsToOverride } from './widgetpicker';
import { GroupWidget } from '../../types/dashboard/widgets/containers/group';
import { TabWidget } from '../../types/dashboard/widgets/containers/tab';
import { ChatLeftTextFill } from 'react-bootstrap-icons';

jest.mock('react-sortablejs', () => ({
    ReactSortable: ({ setList, children, list, ...props }: any) => {
        return (
            <div data-testid={props['data-testid']}>
                <button data-testid='mock-setList-list' onClick={() => setList([{ id: 'libraryItem', item: { type: 'list' } }, ...list])} />
                <button data-testid='mock-setList-group' onClick={() => setList([{ id: 'libraryItem', item: { type: 'group' } }, ...list])} />
                {children}
            </div>
        );
    },
}));

describe('<WidgetPicker />', () => {
    let widgets: Map<string, DashboardWidget> = new Map();
    let onSave = jest.fn();
    let onCancel = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        widgets = new Map([getListWidget(), getLineChartWidget()].map((w) => [w.id, w]));
        onSave = jest.fn();
        onCancel = jest.fn();
    });

    afterEach(() => {
        cleanup();
        jest.resetAllMocks();
        jest.restoreAllMocks();
        jest.resetModules();
        jest.clearAllMocks();
    });

    it('Renders', async () => {
        render(<WidgetPicker widgets={widgets} onSave={onSave} className='test-class' onCancel={onCancel} />);
        const picker = screen.getByTestId('tree-maker');
        expect(picker).toBeInTheDocument();
        expect(picker).toHaveClass('test-class');

        librarySections.forEach((s) => {
            expect(screen.getByText(s.title)).toBeInTheDocument();
            s.widgets.forEach((w) => {
                expect(screen.getByTestId(`${s.title}_${w.item.title}`)).toBeInTheDocument();
            });
        });

        await act(async () => {
            userEvent.click(screen.getByTestId('button-cancel'));
        });
        expect(onCancel).toHaveBeenCalledTimes(1);

        // function is required by library, but this one should do nothing
        await act(async () => {
            userEvent.click(within(screen.getAllByTestId('sortable-library-side')[1]).getAllByTestId('mock-setList-list')[0]);
        });
    });

    it('Add and returns a new widget list', async () => {
        render(<WidgetPicker widgets={widgets} onSave={onSave} onCancel={onCancel} />);

        await act(async () => {
            const dest = screen.getByTestId('sortable-destination');
            userEvent.click(within(dest).getByTestId('mock-setList-list'));
            userEvent.click(within(dest).getByTestId('mock-setList-group'));
        });
        await act(async () => {
            userEvent.click(screen.getByTestId('button-save'));
        });
        expect(onSave).toHaveBeenCalledTimes(1);
        let newWidgets: DashboardWidget[] = Array.from(onSave.mock.calls[0][0].values());

        expect(newWidgets[0].type).toBe('group');
        expect(newWidgets[1].type).toBe('list');

        await act(async () => {
            const dest = screen.getByTestId('sortable-widget-container_group');

            userEvent.click(within(dest).getByTestId('mock-setList-list'));
        });
        await act(async () => {
            userEvent.click(screen.getByTestId('button-save'));
        });
        expect(onSave).toHaveBeenCalledTimes(2);
        newWidgets = Array.from(onSave.mock.calls[1][0].values());
        const group = newWidgets[0] as GroupWidget;
        expect(Array.from(group.chartSettings.widgets.values())[0].type).toBe('list');
    });

    it('Renders container widgets', async () => {
        const group = getGroupWidget();
        const tabs = getTabWidget();
        widgets.set(tabs.id, tabs);
        group.chartSettings.widgets = widgets;
        const widgetItems = widgetsToOverride([group]);
        let setReturn: WidgetItem[] = [];
        const setWidgets = (func: any) => {
            const n = func(widgetItems);
            setReturn = n;
        };
        render(<WidgetItemComponent widget={widgetItems[0]} setWidgets={setWidgets} t={jest.fn()} index={[0]} />);
        const tabSortable = screen.getByTestId('sortable-widget-container_tab');
        expect(tabSortable).toBeInTheDocument();

        await act(async () => {
            userEvent.click(within(tabSortable).getByTestId('mock-setList-group'));
        });

        let groupsWidgetItems = setReturn[0].children;
        let tabsWidgetItems = groupsWidgetItems?.[2].children;
        expect(tabsWidgetItems?.[0].item.type).toBe('group');

        await act(async () => {
            userEvent.click(within(tabSortable).getByTestId('mock-setList-list'));
        });

        groupsWidgetItems = setReturn[0].children;
        tabsWidgetItems = groupsWidgetItems?.[2].children;
        // widgets in test component are appended to start of list for easy access. as such, they are in reverse order as the calls above
        expect(tabsWidgetItems?.[0].item.type).toBe('list');

        const saved = widgetsFromOverride(setReturn);
        const groupMap = (saved[0] as GroupWidget).chartSettings.widgets;
        const tabMap = (Array.from(groupMap.values())[2] as TabWidget).chartSettings.widgets;
        expect(Array.from(tabMap.values())[0].type).toBe('list');
    }, 100000);
});
