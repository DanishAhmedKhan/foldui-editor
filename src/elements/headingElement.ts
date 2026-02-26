import { EditorElement } from './types'

export const HeadingElement: EditorElement = {
    type: 'heading',
    name: 'Heading',
    description: 'Heading',

    create: ({ selectedNodeId, builder }) => {
        return builder
            .add({
                type: 'text',
                props: {
                    tag: 'h1',
                },
                style: {
                    text: { fontSize: '32px' },
                },
            })
            .into(selectedNodeId)
    },
}
