import { EditorElement } from './types'

export const TextElement: EditorElement = {
    type: 'text',
    name: 'Text',
    description: 'Simple text block',

    create: ({ parentNodeId, builder, index }) => {
        return builder
            .add({
                type: 'text',
                editorType: 'text',
                props: {
                    tag: 'p',
                },
                responsive: {
                    text: {
                        base: {
                            fontSize: '40px',
                            color: '#f00',
                        },
                    },
                },
            })
            .into(parentNodeId, index)
    },

    properties: [
        {
            id: 'content',
            label: 'Content',
            fields: [
                {
                    id: 'text',
                    label: 'Text',
                    type: 'text',
                    path: 'props.content',
                },
                {
                    id: 'tag',
                    label: 'Tag',
                    type: 'select',
                    path: 'props.tag',
                    options: [
                        { label: 'Paragraph', value: 'p' },
                        { label: 'Heading 1', value: 'h1' },
                        { label: 'Heading 2', value: 'h2' },
                    ],
                },
            ],
        },
        {
            id: 'typography',
            label: 'Typography',
            fields: [
                {
                    id: 'fontSize',
                    label: 'Font Size',
                    type: 'slider',
                    min: 10,
                    max: 72,
                    styleKey: 'text',
                    responsive: true,
                },
                {
                    id: 'color',
                    label: 'Color',
                    type: 'color',
                    styleKey: 'text',
                    responsive: true,
                },
            ],
        },
    ],
}
