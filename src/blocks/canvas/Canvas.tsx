import React, { useEffect, useRef } from 'react'
import { useEditorStore } from '../../store/useEditorStore'
import { Fold } from 'foldui'
import { useIframeBridge } from './useIframeBridge'
import { CanvasFrame } from './CanvasFrame'

export const Canvas: React.FC = () => {
    const iframeRef = useRef<HTMLIFrameElement | null>(null)

    const version = useEditorStore((s) => s.version)
    const builder = useEditorStore((s) => s.builder)

    const { mountIntoIframe } = useIframeBridge(iframeRef)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const doc = iframe.contentDocument
        if (!doc) return

        const schema = builder.toRenderSchema()
        if (!schema) return

        const htmlElement = Fold.render(schema, doc)
        mountIntoIframe(htmlElement)
    }, [version, builder, mountIntoIframe])

    return (
        <CanvasFrame>
            <iframe
                ref={iframeRef}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: 'lightblue',
                }}
                sandbox="allow-scripts allow-same-origin"
            />
        </CanvasFrame>
    )
}
