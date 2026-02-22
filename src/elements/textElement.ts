import { EditorElement } from './types'

export const TextElement: EditorElement = {
    type: 'text',
    name: 'Text',
    description: 'Simple text block',

    create: ({ selectedNodeId, builder }) => {
        return builder
            .add({
                type: 'text',
                props: {
                    tag: 'h1',
                },
                style: {
                    text: { fontSize: '30px' },
                },
            })
            .into(selectedNodeId)
    },
}
