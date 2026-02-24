import { useEffect } from 'react'
import { Fold } from 'foldui'
import { useEditorStore } from '../../store/useEditorStore'
import { useIframeBridge } from './useIframeBridge'

export function useCanvasRenderer(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
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
    }, [version, builder, mountIntoIframe, iframeRef])
}
