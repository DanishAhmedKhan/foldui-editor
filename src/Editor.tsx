import React, { useEffect } from 'react'
import { useEditorStore } from './store/useEditorStore'
import { Canvas } from './blocks/canvas/Canvas'

export interface FolduiEditorProps {
    schema?: unknown
}

export const FolduiEditor: React.FC<FolduiEditorProps> = ({ schema }) => {
    const setRenderSchema = useEditorStore((s) => s.setRenderSchema)

    // Push schema into builder store whenever it changes
    useEffect(() => {
        if (!schema) return
        setRenderSchema(schema)
    }, [schema, setRenderSchema])

    return (
        <div
            style={{
                width: '100%',
                height: '600px', // important so iframe is visible
                border: '1px solid #ddd',
                background: '#fafafa',
            }}
        >
            <Canvas />
        </div>
    )
}
