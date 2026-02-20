import React, { useEffect, useRef } from 'react'
import { useEditorStore } from '../../store/useEditorStore'
import { Fold } from 'foldui'
import { useIframeBridge } from './useIframeBridge'

export const Canvas: React.FC = () => {
    const iframeRef = useRef<HTMLIFrameElement | null>(null)

    const renderSchema = useEditorStore((s) => s.getRenderSchema)

    const { mountIntoIframe } = useIframeBridge(iframeRef)

    useEffect(() => {
        if (!renderSchema) return

        const htmlElement = Fold.render(renderSchema as any)

        mountIntoIframe(htmlElement)
    }, [renderSchema, mountIntoIframe])

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                background: '#f5f5f5',
            }}
        >
            <iframe
                ref={iframeRef}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: 'white',
                }}
                sandbox="allow-scripts allow-same-origin"
            />
        </div>
    )
}
