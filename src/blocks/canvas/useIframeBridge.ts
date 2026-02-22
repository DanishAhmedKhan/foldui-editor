import { useCallback } from 'react'

export function useIframeBridge(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
    const mountIntoIframe = useCallback(
        (element: Node) => {
            const iframe = iframeRef.current
            if (!iframe) return

            const doc = iframe.contentDocument
            if (!doc) return

            const FOLD_GLOBAL_STYLE_ID = '__fold_global_styles__'

            if (!doc.getElementById(FOLD_GLOBAL_STYLE_ID)) {
                doc.open()
                doc.write(`
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <style id="${FOLD_GLOBAL_STYLE_ID}">
                                * { padding: 0; margin: 0; box-sizing: border-box; }
                                html, body { width: 100%; height: 100%; }
                            </style>
                        </head>
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
        [iframeRef],
    )

    return { mountIntoIframe }
}
