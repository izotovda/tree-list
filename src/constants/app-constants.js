export const MAX_LEVEL_OF_HIERARCHY = 4;

export const DEFAULT_ITEM_TEXT = 'new_node';

export const DEFAULT_INITIAL_LIST_VALUE = [
    {
        name: 'node_1',
        id: 1,
        items: [
            {
                name: 'node_1_1',
                id: 1,
                items: [
                    {
                        name: 'node_1_1_1',
                        id: 1,
                        items: []
                    },
                    {
                        name: 'node_1_1_2',
                        id: 2,
                        items: []
                    },
                    {
                        name: 'node_1_1_3',
                        id: 3,
                        items: []
                    },
                ]
            },
            {
                name: 'node_1_2',
                id: 2,
                items: []
            },
            {
                name: 'node_1_3',
                id: 3,
                items: []
            },
        ]
    },
    {
        name: 'node_2',
        id: 2,
        items: []
    },
    {
        name: 'node_3',
        id: 3,
        items: [
            {
                name: 'node_3_1',
                id: 1,
                items: []
            },
            {
                name: 'node_3_2',
                id: 2,
                items: []
            },
            {
                name: 'node_3_3',
                id: 3,
                items: []
            },
        ]
    },
];
