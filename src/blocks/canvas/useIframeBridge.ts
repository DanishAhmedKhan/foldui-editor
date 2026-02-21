import { useCallback } from 'react'

export function useIframeBridge(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
    const mountIntoIframe = useCallback(
        (element: Node) => {
            const iframe = iframeRef.current
            if (!iframe) return

            const doc = iframe.contentDocument
            if (!doc) return

            if (!doc.body.innerHTML) {
                doc.open()
                doc.write(`
          <!DOCTYPE html>
          <html>
            <head></head>
            <body>
              <div id="root"></div>
            </body>
          </html>
        `)
                doc.close()
            }

            const root = doc.getElementById('root')
            if (!root) return

            root.innerHTML = ''
            root.appendChild(element)
        },
        [iframeRef], // ✅ FIX
    )

    return { mountIntoIframe }
}
