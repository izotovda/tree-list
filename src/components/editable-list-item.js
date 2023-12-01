import { memo, useEffect, useRef, useState } from 'react';
import { MAX_LEVEL_OF_HIERARCHY } from './../constants/app-constants';
import './editable-list-item.css';

const DEFAULT_ITEM_TEXT = 'text';

function EditableListItem({ id, onDelete, currentLevel }) {
    const [items, setItems] = useState([]);
    const [maxId, setMaxId] = useState(0);
    const [isEditable, setIsEditable] = useState(false);
    const [textValue, setTextValue] = useState(DEFAULT_ITEM_TEXT);
    const inputRef = useRef(null);
    const inputContainerRef = useRef(null);

    useEffect(() => {
        if (!isEditable) {
            return;
        }

        const hideInput = (event) => {
            if (!inputContainerRef.current.contains(event.target)) {
                setIsEditable(false);
            }
        };

        setTimeout(() => window.addEventListener('click', hideInput));


        return () => {
            window.removeEventListener('click', hideInput);
        };
    }, [isEditable]);

    const addItem = () => {
        setItems([...items, { id: maxId }]);
        setMaxId(prevId => prevId += 1);
    };

    const removeItem = (id) => {
        const filteredItems = items.filter((item) => id !== item.id);
        setItems(filteredItems);
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

    const addButton = currentLevel <= MAX_LEVEL_OF_HIERARCHY
        ? <button onClick={() => addItem()}>Add</button>
        : null;

    const mainElement = isEditable
        ? (
            <div className='item-content-container' ref={inputContainerRef}>
                <input
                    onChange={(event) => setTextValue(event.target.value)}
                    onKeyDown={handleEnter}
                    value={textValue}
                    ref={inputRef}
                />
                <button onClick={() => setIsEditable(false)}>Confirm</button>
            </div>
        )
        : (
            <div className='item-content-container'>
                <span>{textValue}</span>
                <div className='buttons-container-wrapper'>
                    <div className='buttons-container'>
                        {addButton}
                        <button onClick={handleEditClick}>Edit</button>
                        <button onClick={() => onDelete(id)}>Remove</button>
                    </div>
                </div>
            </div>
        );

    const list = items.length
        ? <ul>
            {items.map((item) =>
                <EditableListItem
                    id={item.id}
                    onDelete={removeItem}
                    key={item.id}
                    currentLevel={currentLevel + 1}
                />
            )}
        </ul>
        : null;

    return (
        <li>
            {mainElement}
            {list}
        </li>
    );
}

export default memo(EditableListItem);