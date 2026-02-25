import { useEffect, useState } from 'react'
import { createActionBar } from './overlay/createActionBar'
import { useEditorStore } from '../../store/useEditorStore'
import { icons } from '../../assets/icons'

interface Props {
    iframeRef: React.RefObject<HTMLIFrameElement | null>
}

const OVERLAY_COLORS = {
    hover: {
        border: 'dodgerblue',
        background: 'rgba(30,144,255,0.08)',
    },
    selected: {
        border: 'orange',
        background: 'rgba(255,165,0,0.08)',
    },
}

export function useCanvasOverlay({ iframeRef }: Props) {
    const version = useEditorStore((s) => s.version)
    const builder = useEditorStore((s) => s.builder)

    const selectedNodeId = useEditorStore((s) => s.selectedNodeId)
    const setSelectedNodeId = useEditorStore((s) => s.setSelectedNodeId)

    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const doc = iframe.contentDocument
        if (!doc) return

        function getNodeId(target: HTMLElement | null) {
            return target?.closest('[data-fui-id]')?.getAttribute('data-fui-id') ?? null
        }

        function handleMouseMove(e: MouseEvent) {
            const nodeId = getNodeId(e.target as HTMLElement)

            if (!nodeId || nodeId === selectedNodeId) {
                setHoveredNodeId(null)
                return
            }

            setHoveredNodeId(nodeId)
        }

        function handleClick(e: MouseEvent) {
            const nodeId = getNodeId(e.target as HTMLElement)

            if (!nodeId) {
                setSelectedNodeId(null)
                return
            }

            e.preventDefault()
            e.stopPropagation()
            setSelectedNodeId(nodeId)
        }

        function handleLeave() {
            setHoveredNodeId(null)
        }

        doc.addEventListener('mousemove', handleMouseMove)
        doc.addEventListener('click', handleClick)
        doc.addEventListener('mouseleave', handleLeave)

        return () => {
            doc.removeEventListener('mousemove', handleMouseMove)
            doc.removeEventListener('click', handleClick)
            doc.removeEventListener('mouseleave', handleLeave)
        }
    }, [iframeRef, version, selectedNodeId, setSelectedNodeId])

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const doc = iframe.contentDocument!
        if (!doc) return

        doc.body.style.position = 'relative'

        // Remove old root
        const existing = doc.getElementById('__overlay_root__')
        if (existing) existing.remove()

        const root = doc.createElement('div')
        root.id = '__overlay_root__'

        Object.assign(root.style, {
            position: 'absolute',
            inset: '0',
            pointerEvents: 'none',
            zIndex: '999999',
        })

        doc.body.appendChild(root)

        const activeNodeId = selectedNodeId ?? hoveredNodeId
        if (!activeNodeId) return

        const el = doc.querySelector(`[data-fui-id="${activeNodeId}"]`) as HTMLElement | null
        if (!el) return

        const win = doc.defaultView!
        if (!win) return

        function render() {
            root.innerHTML = ''

            const rect = el!.getBoundingClientRect()
            const scrollX = win.scrollX
            const scrollY = win.scrollY

            const isSelected = selectedNodeId === activeNodeId
            const colors = isSelected ? OVERLAY_COLORS.selected : OVERLAY_COLORS.hover

            const box = doc.createElement('div')

            Object.assign(box.style, {
                position: 'absolute',
                top: rect.top + scrollY + 'px',
                left: rect.left + scrollX + 'px',
                width: rect.width + 'px',
                height: rect.height + 'px',
                border: `2px solid ${colors.border}`,
                background: colors.background,
                boxSizing: 'border-box',
                pointerEvents: 'none',
            })

            root.appendChild(box)

            if (!isSelected) return

            const actionBar = createActionBar(
                doc,
                {
                    ...rect,
                    top: rect.top + scrollY,
                    left: rect.left + scrollX,
                } as DOMRect,
                [{ type: 'copy' }, { type: 'move' }, { type: 'delete' }],
                {
                    placement: 'top-left',
                    offset: 0,
                    outside: false,
                },
                'horizontal',
                (type) => {
                    if (type === 'delete') builder.remove(activeNodeId!)
                    if (type === 'copy') builder.copy(activeNodeId)
                    if (type === 'move') console.log('move')
                },
                {
                    background: colors.border,
                    iconColor: 'white',
                    iconBackground: 'transparent',
                    customIcons: {
                        delete: icons.delete,
                        copy: icons.copy,
                        move: icons.move,
                    },
                },
            )

            actionBar.style.pointerEvents = 'auto'
            actionBar.style.position = 'absolute'
            actionBar.style.background = colors.border
            actionBar.style.borderRadius = '6px'

            root.appendChild(actionBar)
        }

        render()

        win.addEventListener('scroll', render)
        win.addEventListener('resize', render)

        return () => {
            win.removeEventListener('scroll', render)
            win.removeEventListener('resize', render)
        }
    }, [iframeRef, selectedNodeId, hoveredNodeId, version, builder])
}
