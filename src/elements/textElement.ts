import { EditorElement } from './types'

export const TextElement: EditorElement = {
    type: 'text',
    name: 'Text',
    description: 'Simple text block',

    create: () => ({
        type: 'text',
        props: {
            text: 'This is a text',
        },
    }),
}
