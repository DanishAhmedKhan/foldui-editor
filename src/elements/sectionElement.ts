import { EditorElement } from './types'

export const SectionElement: EditorElement = {
    type: 'section',
    name: 'Section',
    description: 'Section',

    create: ({ parentNodeId, builder, index }) => {
        const columnCount = 2

        const sectionId = builder
            .add({
                type: 'section',
                editorType: 'section',
                responsive: {
                    section: {
                        base: {
                            padding: '100px 0px',
                        },
                    },
                },
            })
            .into(parentNodeId, index)

        const rowId = builder
            .add({
                type: 'container',
                editorType: 'row',
                responsive: {
                    container: {
                        base: {
                            display: 'grid',
                            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                            gap: 50,
                            maxWidth: 800,
                            margin: '0 auto',
                        },
                    },
                },
            })
            .into(sectionId)

        for (let i = 0; i < columnCount; i++) {
            builder
                .add({
                    type: 'container',
                    editorType: 'column',
                    responsive: {
                        container: {
                            base: {
                                display: 'flex',
                                flexDirection: 'column',
                            },
                        },
                    },
                })
                .into(rowId)
        }

        return sectionId
    },
}
