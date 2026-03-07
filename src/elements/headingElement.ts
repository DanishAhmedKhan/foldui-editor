import { EditorElement } from './types'

export const HeadingElement: EditorElement = {
    type: 'heading',
    name: 'Heading',
    description: 'Heading',

    create: ({ parentNodeId, builder, index }) => {
        return builder
            .add({
                type: 'text',
                editorType: 'heading',
                props: { tag: 'h1' },
                responsive: {
                    text: {
                        base: {
                            fontSize: 32,
                        },
                    },
                },
            })
            .into(parentNodeId, index)
    },
}
