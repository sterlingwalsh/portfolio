import React, { useMemo, useRef, useState } from 'react';

import { ReactSortable } from 'react-sortablejs';

import { StyledButton } from '../buttons/styledbutton';

import { v4 as uuid } from 'uuid';

export interface TreeMakerProps<T = unknown> {
    items?: T[];
    onSave?: (items: T[]) => void;
    optionIsContainer?: (option: T) => boolean;
    onCancel?: () => void;
    options: T[];
    getChildren: (item: T) => T[];
    setChildren: (item: T, children: T[]) => T;
    getItemlabel: (item: T) => string;
    generateNewItem?: (item: T) => T;
}

export const LIBRARY_ID = 'libraryItem';

const sortableOptions = {
    animation: 150,
    fallbackOnBody: true,
    ghostClass: 'ghost',
    group: 'tree-maker',
    invertSwap: true,
};

export interface TreeItem<T = unknown> {
    id: string;
    item: T;
    children?: TreeItem<T>[];
}

export interface TreeItemContainer<T = unknown> {
    id: string;
    item: T;
    children: TreeItem<T>[];
}

export function itemsToOverride<T = unknown>(items: T[], getChildren?: (item: T) => T[]): TreeItem<T>[] {
    return items.map((item, i) => ({
        id: uuid(),
        item,
        children: getChildren ? itemsToOverride(getChildren(item)) : undefined,
    }));
}

export function itemsFromOverride<T = unknown>(widgetItems: TreeItem<T>[], setChildren?: (item: T, children: T[]) => T): T[] {
    return widgetItems.map((w, i) => {
        const { children } = w;
        return children && setChildren ? setChildren(w.item, itemsFromOverride(children, setChildren)) : w.item;
    });
}

export function TreeMaker<T = unknown>({
    items: itemsInit = [],
    options,
    onSave,
    onCancel,
    getChildren,
    setChildren,
    optionIsContainer,
    getItemlabel,
    generateNewItem = (item: T) => ({ ...item }),
    ...props
}: TreeMakerProps<T> & React.HTMLAttributes<HTMLDivElement>) {
    const [items, setitems] = useState<TreeItem<T>[]>(() => itemsToOverride(itemsInit));
    const refs = useRef({ optionIsContainer });
    refs.current.optionIsContainer = optionIsContainer;

    const handleSave = () => {
        onSave?.(itemsFromOverride<T>(items));
    };

    const handleCancel = () => {
        setitems(itemsToOverride(Array.from(itemsInit.values())));
        onCancel?.();
    };

    const librarySections = useMemo(() => {
        const sections: { title: string; items: TreeItem[] }[] = [
            {
                title: 'Containers',
                items: [],
            },
            {
                title: 'Items',
                items: [],
            },
        ];
        options.forEach((o) => {
            sections[optionIsContainer?.(o) ? 0 : 1].items.push({ id: LIBRARY_ID, item: o });
        });
        return sections;
    }, [optionIsContainer, options]);

    return (
        <div data-testid='tree-maker' {...props} className={`tree-maker__container${props.className ? ` ${props.className}` : ''}`}>
            <div className='tree-maker__column__container'>
                <div className='tree-maker__column'>
                    {librarySections.map((s) => (
                        <div key={s.title} className='tree-maker__section'>
                            <div className='section__title'>{s.title}</div>
                            <ReactSortable
                                data-testid='sortable-library-side'
                                className='tree-maker__section__options'
                                list={s.items}
                                group={{ name: 'tree-maker', pull: 'clone', put: false }}
                                sort={false}
                                setList={() => {}}
                            >
                                {s.items.map((item, i) => (
                                    <div key={i} data-testid={`${s.title}_${getItemlabel(item.item as T)}`} className='tree-maker__item'>
                                        {getItemlabel(item.item as T)}
                                    </div>
                                ))}
                            </ReactSortable>
                        </div>
                    ))}
                </div>
            </div>
            <div></div>
            <div className='tree-maker__column__container'>
                <div className='tree-maker__column'>
                    <ReactSortable
                        data-testid='sortable-destination'
                        list={items}
                        {...sortableOptions}
                        className='tree-maker-target'
                        setList={(currentList) => {
                            const newItemIdx = currentList.findIndex((l, idx) => l.id === LIBRARY_ID);
                            /* istanbul ignore else */
                            if (newItemIdx > -1) {
                                const newItem: TreeItem<T> = { id: uuid(), item: generateNewItem(currentList[newItemIdx].item) };
                                newItem.children = optionIsContainer?.(newItem.item as T) ? [] : undefined;
                                currentList[newItemIdx] = newItem;
                            }
                            setitems(currentList);
                        }}
                    >
                        {items.map((item, i) => (
                            <TreeItemComponent<T>
                                optionIsContainer={optionIsContainer}
                                getItemlabel={getItemlabel}
                                generateNewItem={generateNewItem}
                                key={item.id}
                                item={item}
                                index={[i]}
                                setitems={setitems}
                            />
                        ))}
                    </ReactSortable>
                </div>
            </div>
            <div className='button__row button__row__right tree-maker__button__row'>
                <StyledButton data-testid='button-save' color='action' variant='contained' onClick={handleSave}>
                    {'Save'}
                </StyledButton>
                <StyledButton data-testid='button-cancel' color='secondary' variant='contained' onClick={handleCancel}>
                    {'Cancel'}
                </StyledButton>
            </div>
        </div>
    );
}

interface TreeDisplayItem<T = unknown> {
    setitems: React.Dispatch<React.SetStateAction<TreeItem<T>[]>>;
    index: number[];
    getItemlabel: (item: T) => string;
    generateNewItem: (item: T) => T;
    optionIsContainer?: (option: T) => boolean;
}

function TreeContainerItem<T = unknown>({ item, setitems, index, getItemlabel, generateNewItem, optionIsContainer }: TreeDisplayItem<T> & { item: TreeItemContainer<T> }) {
    return (
        <div className='tree-maker__item'>
            <div>{getItemlabel(item.item as T)}</div>
            <ReactSortable
                list={item.children}
                {...sortableOptions}
                className='tree-maker__sortable__container'
                setList={(currentList: TreeItem<T>[]) => {
                    /* istanbul ignore else */
                    const newItemIdx = currentList.findIndex((l, idx) => l.id === LIBRARY_ID);
                    /* istanbul ignore else */
                    if (newItemIdx > -1) {
                        const newItem: TreeItem<T> = { id: uuid(), item: generateNewItem(currentList[newItemIdx].item as T) };
                        newItem.children = optionIsContainer?.(newItem.item as T) ? [] : undefined;
                        currentList[newItemIdx] = newItem;
                    }
                    setitems((sourceList) => {
                        const tempList = [...sourceList];
                        const _index = [...index];
                        const lastIndex = _index.pop();
                        const lastArr = _index.reduce((arr, i) => arr[i].children!, tempList);
                        const item = lastArr[lastIndex!];
                        item.children = currentList;
                        return tempList;
                    });
                }}
            >
                {item.children!.map((child, i) => (
                    <TreeItemComponent
                        getItemlabel={getItemlabel}
                        optionIsContainer={optionIsContainer}
                        generateNewItem={generateNewItem}
                        key={child.id}
                        item={child}
                        setitems={setitems}
                        index={[...index, i]}
                    />
                ))}
            </ReactSortable>
        </div>
    );
}

export function TreeItemComponent<T = unknown>({ item, setitems, index, getItemlabel, ...props }: TreeDisplayItem<T> & { item: TreeItem<T> }) {
    if (item.children) {
        return <TreeContainerItem<T> item={item as TreeItemContainer<T>} setitems={setitems} index={index} getItemlabel={getItemlabel} {...props} />;
    } else {
        return <div className='tree-maker__item'>{getItemlabel(item.item)}</div>;
    }
}
