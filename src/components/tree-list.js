import { memo, useState } from 'react';
import EditableListItem from './editable-list-item';

function TreeList() {
    const [items, setItems] = useState([]);
    const [maxId, setMaxId] = useState(0);

    const addItem = () => {
        setItems([...items, { id: maxId, text: 'item' }]);
        setMaxId(prevId => prevId += 1);
    };

    const removeItem = (id) => {
        const filteredItems = items.filter((item) => id !== item.id);
        setItems(filteredItems);
    };

    const resetList = () => {
        setItems([]);
        setMaxId(0);
    };

    const listItems = items.map((item) =>
        <EditableListItem
            id={item.id}
            onDelete={removeItem}
            key={item.id}
            currentLevel={1}
        />
    );

    const list = listItems.length
        ? <ul>{listItems}</ul>
        : null;

    return (
        <>
            <button onClick={() => addItem()}>Add</button>
            <button onClick={() => resetList()}>Reset</button>
            {list}
        </>
    );
}

export default memo(TreeList);