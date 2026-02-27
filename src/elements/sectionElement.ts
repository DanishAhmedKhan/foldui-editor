import { EditorElement } from './types'

export const SectionElement: EditorElement = {
    type: 'section',
    name: 'Section',
    description: 'Section',

    create: ({ parentNodeId, builder, index }) => {
        const columnCount = 2

        const sectionId = builder.add('section').into(parentNodeId, index)
        const rowId = builder
            .add({
                type: 'container',
                props: {
                    layout: {
                        type: 'grid',
                        columns: columnCount,
                        gap: 50,
                    },
                },
                style: {
                    container: {
                        maxWidth: '800px',
                        margin: '0 auto',
                    },
                },
            })
            .into(sectionId)

        for (let i = 0; i < columnCount; i++) {
            const containerId = builder
                .add({
                    type: 'container',
                    props: {
                        layout: {
                            type: 'flex',
                            direction: 'vertical',
                        },
                    },
                })
                .into(rowId)

            // builder.add('text').into(containerId)
        }

        return sectionId
    },
}
