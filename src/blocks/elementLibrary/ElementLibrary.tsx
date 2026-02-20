import React from 'react'
import { useEditorStore } from '../../store/useEditorStore'

export const ElementLibrary: React.FC = () => {
    const addElement = useEditorStore((s) => s.addElement)

    return (
        <div
            style={{
                padding: 16,
                borderRight: '1px solid #ddd',
                height: '100%',
            }}
        >
            <h3>Components</h3>

            <button
                onClick={() =>
                    addElement({
                        type: 'text',
                        content: 'New Text Block',
                    })
                }
            >
                Add Text
            </button>

            <br />
            <br />

            <button
                onClick={() =>
                    addBlock({
                        type: 'container',
                        children: [{ type: 'text', content: 'Inside Container' }],
                    })
                }
            >
                Add Container
            </button>
        </div>
    )
}
