import { EditorElement } from './types'

export const TextElement: EditorElement = {
    type: 'text',
    name: 'Text',
    description: 'Simple text block',

    create: ({ parentNodeId, builder, index }) => {
        return builder
            .add({
                type: 'text',
                props: {
                    tag: 'p',
                },
                style: {
                    text: { fontSize: '16px' },
                },
            })
            .into(parentNodeId, index)
    },
}
