import { useEffect } from 'react'
import { useEditorStore } from '../store/useEditorStore'
import { registerDefaultElements } from '../elements/initDefaultElements'
import { editorEventBus } from '../events/editorEventBus'
import { Fold } from 'foldui'

export function useEditorInitialization(schema?: unknown) {
    const builder = useEditorStore((s) => s.builder)
    const selectNode = useEditorStore((s) => s.setSelectedNodeId)

    Fold.use({
        beforeRender({ node, styleEngine }) {
            const parseMediaKey = (key: string) => {
                const minMatch = key.match(/^min-(\d+)$/)
                if (minMatch) return `(min-width: ${minMatch[1]}px)`

                const maxMatch = key.match(/^max-(\d+)$/)
                if (maxMatch) return `(max-width: ${maxMatch[1]}px)`

                return null
            }

            const responsive = node?.responsive
            if (!responsive || !styleEngine) return

            for (const part in responsive) {
                const config = responsive[part]

                for (const media in config) {
                    const styleObj = config[media]
                    if (!styleObj) continue

                    const selector = `[data-fui-id="${node.id}"][data-part="${part}"]`

                    if (media === 'base') {
                        styleEngine.push(selector, styleObj)
                    } else {
                        const mediaQuery = parseMediaKey(media)
                        if (!mediaQuery) continue

                        styleEngine.push(selector, styleObj, mediaQuery)
                    }
                }
            }
        },
    })

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
