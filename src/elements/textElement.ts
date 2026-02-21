import { EditorElement } from './types'

export const TextElement: EditorElement = {
    type: 'text',
    name: 'Text',
    description: 'Simple text block',

    create: ({ selectedNodeId, builder }) => {
        return builder.add('text').into(selectedNodeId)
    },
}
