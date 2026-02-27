import { EditorElement } from './types'

export const ButtonElement: EditorElement = {
    type: 'button',
    name: 'Button',
    description: 'Click Now',

    create: ({ parentNodeId, builder, index }) => {
        return builder.add('button').into(parentNodeId, index)
    },
}
