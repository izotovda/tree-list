import { useEffect, useRef, useState } from 'react';
import {
    DEFAULT_INITIAL_LIST_VALUE,
    DEFAULT_ITEM_TEXT,
    MAX_LEVEL_OF_HIERARCHY
} from './../constants/app-constants';
import './tree-list.css';

function TreeList({
    node,
    level,
    onDelete,
    updateParentList
}) {
    const [levelZeroItems, setLevelZeroItems] = useState([]);
    const [currentMaxId, setCurrentMaxId] = useState(0);
    const [isEditable, setIsEditable] = useState(false);
    const inputRef = useRef(null);
    const inputContainerRef = useRef(null);

    const setMaxId = (list) => {
        if (!list.length) {
            setCurrentMaxId(0);
        }

        const maxId = list.reduce((acc, item) => item.id > acc ? item.id : acc, 0);

        setCurrentMaxId(maxId + 1);
    };

    useEffect(() => {
        if (level === 0) {
            const treeList = localStorage.getItem("treeList");

            const parsedTreeList = treeList
                ? JSON.parse(treeList)
                : null;

            const list = parsedTreeList?.length
                ? parsedTreeList
                : DEFAULT_INITIAL_LIST_VALUE;

            setLevelZeroItems(list);

            setMaxId(list);
        } else {
            setMaxId(node.items);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isEditable || level === 0) {
            return;
        }

        const hideInput = (event) => {
            if (!inputContainerRef.current.contains(event.target)) {
                setIsEditable(false);
            }
        };

        setTimeout(() => window.addEventListener('click', hideInput));

        return () => window.removeEventListener('click', hideInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditable]);

    const addItem = () => {
        setCurrentMaxId(prevId => prevId += 1);

        if (level === 0) {
            setLevelZeroItems([...levelZeroItems, { name: DEFAULT_ITEM_TEXT, id: currentMaxId, items: [] }]);
            return;
        }

        const updatedNode = {
            ...node,
            items: [
                ...node.items,
                { name: DEFAULT_ITEM_TEXT, id: currentMaxId, items: [] }
            ]
        };

        updateParentList(updatedNode);
    };

    const removeItem = (id) => {
        if (level === 0) {
            const filteredItems = levelZeroItems.filter((item) => id !== item.id);

            setLevelZeroItems(filteredItems);

            return;
        }
        const filteredItems = node.items.filter((item) => id !== item.id);

        const updatedNode = {
            ...node,
            items: filteredItems
        };

        updateParentList(updatedNode);
    };

    const updateList = (childNode) => {
        const items = level === 0 ? [...levelZeroItems] : [...node.items];
        const itemToUpdate = items.find(item => item.id === childNode.id);
        const index = items.indexOf(itemToUpdate);

        items[index] = { ...childNode };

        if (level === 0) {
            setLevelZeroItems(items);
        } else {
            updateParentList({
                ...node,
                items: items
            });
        }
    };

    const listToRender = level === 0 ? levelZeroItems : node.items;

    const list = listToRender.length
        ? <ul>
            {listToRender.map((item) =>
                <TreeList
                    node={item}
                    key={item.id}
                    level={level + 1}
                    onDelete={removeItem}
                    updateParentList={updateList}
                />
            )}
        </ul>
        : null;

    if (level === 0) {
        const resetList = () => {
            setLevelZeroItems([]);
            setCurrentMaxId(0);
        };

        const saveList = () => {
            localStorage.setItem("treeList", JSON.stringify(levelZeroItems));
        };

        const loadList = () => {
            const treeList = localStorage.getItem("treeList");

            if (treeList) {
                const list = JSON.parse(treeList);

                setLevelZeroItems(list);
                setMaxId(list);
            }
        };

        return (
            <>
                <button onClick={() => addItem()}>Add</button>
                <button onClick={() => resetList()}>Reset</button>
                <button onClick={() => saveList()}>Save</button>
                <button onClick={() => loadList()}>Load</button>
                <ul>{list}</ul>
            </>
        );
    }

    const setName = (value) => {
        const updatedNode = {
            ...node,
            name: value
        };

        updateParentList(updatedNode);
    };

    const handleEditClick = () => {
        setIsEditable(true);
        setTimeout(() => inputRef.current.focus());
    };

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            setIsEditable(false);
        }
    };

    const addButton = level <= MAX_LEVEL_OF_HIERARCHY
        ? <button onClick={() => addItem()}>Add</button>
        : null;

    const mainElement = isEditable
        ? (
            <div className='item-content-container' ref={inputContainerRef}>
                <input
                    onChange={(event) => setName(event.target.value)}
                    onKeyDown={handleEnter}
                    value={node.name}
                    ref={inputRef}
                />
                <button onClick={() => setIsEditable(false)}>Confirm</button>
            </div>
        )
        : (
            <div className='item-content-container'>
                <span>{node.name}</span>
                <div className='buttons-container-wrapper'>
                    <div className='buttons-container'>
                        {addButton}
                        <button onClick={handleEditClick}>Edit</button>
                        <button onClick={() => onDelete(node.id)}>Remove</button>
                    </div>
                </div>
            </div>
        );

    return (
        <li>
            {mainElement}
            {list}
        </li>
    );
}

export default TreeList;