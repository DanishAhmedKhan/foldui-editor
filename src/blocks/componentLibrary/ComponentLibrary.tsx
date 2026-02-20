import React from 'react'
import { useEditorStore } from '../../store/useEditorStore'

export const ComponentLibrary: React.FC = () => {
    const addBlock = useEditorStore((s) => s.addBlock)

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
                    addBlock({
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
