import { useEffect, useCallback } from 'react'
import { useEditorStore } from '../../store/useEditorStore'

export function useCanvasOverlay(iframeRef: React.RefObject<HTMLIFrameElement>) {
    const version = useEditorStore((s) => s.version)
    const builder = useEditorStore((s) => s.builder)

    const showOverlay = useCallback(
        (target: HTMLElement, root: HTMLElement, nodeId: string) => {
            root.innerHTML = ''

            const rect = target.getBoundingClientRect()
            const doc = target.ownerDocument

            // ===== Border =====
            const box = doc.createElement('div')

            Object.assign(box.style, {
                position: 'fixed',
                top: rect.top + 'px',
                left: rect.left + 'px',
                width: rect.width + 'px',
                height: rect.height + 'px',
                border: '2px solid #4f46e5',
                boxSizing: 'border-box',
                pointerEvents: 'none',
            })

            root.appendChild(box)

            // ===== Actions =====
            const actions = doc.createElement('div')

            Object.assign(actions.style, {
                position: 'fixed',
                top: rect.top - 30 + 'px',
                left: rect.left + 'px',
                background: '#111',
                color: 'white',
                padding: '4px 8px',
                fontSize: '12px',
                borderRadius: '4px',
                pointerEvents: 'auto',
                display: 'flex',
                gap: '6px',
            })

            actions.innerHTML = `
                <button data-action="delete">Delete</button>
            `

            actions.addEventListener('click', (e) => {
                const action = (e.target as HTMLElement).dataset.action
                if (!action) return

                if (action === 'delete') {
                    builder.remove(nodeId)
                }
            })

            root.appendChild(actions)
        },
        [builder],
    )

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const doc = iframe.contentDocument
        if (!doc) return

        // ===== Create Overlay Root (Once) =====
        let overlayRoot = doc.getElementById('__foldui_overlay_root__') as HTMLElement

        if (!overlayRoot) {
            overlayRoot = doc.createElement('div')
            overlayRoot.id = '__foldui_overlay_root__'

            Object.assign(overlayRoot.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: '999999',
            })

            doc.body.appendChild(overlayRoot)
        }

        let currentNodeId: string | null = null

        function handleMouseMove(e: MouseEvent) {
            const target = e.target as HTMLElement
            if (!target) return

            const nodeId = target.closest('[data-fui-id]')?.getAttribute('data-fui-id')

            if (!nodeId) return

            if (nodeId === currentNodeId) return
            currentNodeId = nodeId

            const el = doc?.querySelector(`[data-fui-id="${nodeId}"]`) as HTMLElement

            if (!el) return

            showOverlay(el, overlayRoot, nodeId)
        }

        function handleMouseLeave() {
            overlayRoot.innerHTML = ''
            currentNodeId = null
        }

        doc.addEventListener('mousemove', handleMouseMove)
        doc.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            doc.removeEventListener('mousemove', handleMouseMove)
            doc.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [version, iframeRef, showOverlay])
}
