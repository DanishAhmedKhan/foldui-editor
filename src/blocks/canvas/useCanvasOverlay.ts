import { useEffect, useCallback } from 'react'
import { useEditorStore } from '../../store/useEditorStore'

export function useCanvasOverlay(iframeRef: React.RefObject<HTMLIFrameElement | null>) {
    const version = useEditorStore((s) => s.version)
    const builder = useEditorStore((s) => s.builder)
    const selectedNodeId = useEditorStore((s) => s.selectedNodeId)
    const setSelectedNodeId = useEditorStore((s) => s.selectNode)

    const showOverlay = useCallback(
        (target: HTMLElement, root: HTMLElement, nodeId: string) => {
            root.innerHTML = ''

            const rect = target.getBoundingClientRect()
            const doc = target.ownerDocument

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

            const actions = doc.createElement('div')

            Object.assign(actions.style, {
                position: 'fixed',
                top: rect.top + 'px',
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

        let overlayRoot = doc.getElementById('__foldui_overlay_root__') as HTMLElement
        let selectionRoot = doc.getElementById('__fui_selection_overlay_root__') as HTMLElement

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

        if (!selectionRoot) {
            selectionRoot = doc.createElement('div')
            selectionRoot.id = '__fui_selection_overlay_root__'
            Object.assign(selectionRoot.style, {
                position: 'fixed',
                inset: '0',
                pointerEvents: 'none',
                zIndex: '999999',
            })
            doc.body.appendChild(selectionRoot)
        }

        let currentNodeId: string | null = null

        function handleMouseMove(e: MouseEvent) {
            const target = e.target as HTMLElement
            if (!target) return

            const nodeId = target.closest('[data-fui-id]')?.getAttribute('data-fui-id')

            if (nodeId === selectedNodeId) return

            if (!nodeId) {
                overlayRoot.innerHTML = ''
                currentNodeId = null
                return
            }

            if (nodeId === currentNodeId) return
            currentNodeId = nodeId

            const el = doc?.querySelector(`[data-fui-id="${nodeId}"]`) as HTMLElement

            if (!el) return

            showOverlay(el, overlayRoot, nodeId)
        }

        function handleClick(e: MouseEvent) {
            const target = e.target as HTMLElement
            if (!target) return

            const nodeId = target.closest('[data-fui-id]')?.getAttribute('data-fui-id')

            if (!nodeId) {
                setSelectedNodeId(null)
                return
            }

            e.preventDefault()
            e.stopPropagation()

            setSelectedNodeId(nodeId)
        }

        function handleMouseLeave() {
            overlayRoot.innerHTML = ''
            currentNodeId = null
        }

        doc.addEventListener('mousemove', handleMouseMove)
        doc.addEventListener('mouseleave', handleMouseLeave)
        doc.addEventListener('click', handleClick)

        return () => {
            doc.removeEventListener('mousemove', handleMouseMove)
            doc.removeEventListener('mouseleave', handleMouseLeave)
            doc.removeEventListener('click', handleClick)
        }
    }, [version, iframeRef, showOverlay, setSelectedNodeId, selectedNodeId])

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const doc = iframe.contentDocument
        if (!doc) return

        let selectionRoot = doc.getElementById('__fui_selection_overlay__') as HTMLElement

        if (!selectionRoot) {
            selectionRoot = doc.createElement('div')
            selectionRoot.id = '__fui_selection_overlay__'

            Object.assign(selectionRoot.style, {
                position: 'fixed',
                inset: '0',
                pointerEvents: 'none',
                zIndex: '999999',
            })

            doc.body.appendChild(selectionRoot)
        }

        selectionRoot.innerHTML = ''

        if (!selectedNodeId) return

        const el = doc.querySelector(`[data-fui-id="${selectedNodeId}"]`) as HTMLElement

        if (!el) return

        const rect = el.getBoundingClientRect()

        const box = doc.createElement('div')

        Object.assign(box.style, {
            position: 'fixed',
            top: rect.top + 'px',
            left: rect.left + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px',
            border: '2px solid orange',
            boxSizing: 'border-box',
            pointerEvents: 'none',
        })

        selectionRoot.appendChild(box)
    }, [selectedNodeId, version, iframeRef])
}
