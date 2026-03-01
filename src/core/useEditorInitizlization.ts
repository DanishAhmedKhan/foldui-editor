import { useEffect } from 'react'
import { useEditorStore } from '../store/useEditorStore'
import { registerDefaultElements } from '../elements/initDefaultElements'
import { editorEventBus } from '../events/editorEventBus'

export function useEditorInitialization(schema?: unknown) {
    const builder = useEditorStore((s) => s.builder)
    const selectNode = useEditorStore((s) => s.setSelectedNodeId)

    useEffect(() => {
        registerDefaultElements()

        // if (schema) {
        //     builder.loadSchema(schema)
        //     // editorEventBus.emit('SchemaLoaded', { schema })
        // }

        const rootId = builder.getRootId()
        selectNode(rootId)

        // editorEventBus.emit('EditorInitialized', {})
    }, [])
}
