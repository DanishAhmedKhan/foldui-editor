import { EditorElement } from './types'

export const ButtonElement: EditorElement = {
    type: 'button',
    name: 'Button',
    description: 'Click Now',

    create: ({ selectedNodeId, builder }) => {
        return builder.add('button').into(selectedNodeId)
    },
}
