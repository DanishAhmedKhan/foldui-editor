import React from 'react'

export interface FolduiEditorProps {
    schema?: unknown
}

export const FolduiEditor: React.FC<FolduiEditorProps> = ({ schema }) => {
    return (
        <div>
            <h2>Foldui Editor</h2>
            <pre>{JSON.stringify(schema, null, 2)}</pre>
        </div>
    )
}
