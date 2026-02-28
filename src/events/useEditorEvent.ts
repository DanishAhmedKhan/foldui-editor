import { useEffect } from 'react'
import { editorEventBus } from './editorEventBus'
import { EditorEventMap } from './editorEvents'

export function useEditorEvent<K extends keyof EditorEventMap>(
    event: K,
    handler: (payload: EditorEventMap[K]) => void,
) {
    useEffect(() => {
        return editorEventBus.on(event, handler)
    }, [event, handler])
}
