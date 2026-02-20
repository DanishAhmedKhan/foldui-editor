import { useCallback } from 'react'

export function useIframeBridge(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
    const mountIntoIframe = useCallback(
        (element: Node) => {
            const iframe = iframeRef.current
            if (!iframe) return

            const doc = iframe.contentDocument
            if (!doc) return

            const root = doc.getElementById('root')
            if (!root) return

            root.innerHTML = ''
            root.appendChild(element)
        },
        [iframeRef], // ✅ FIX: include iframeRef
    )

    return { mountIntoIframe }
}
