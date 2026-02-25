import { useEffect, useRef, useState } from 'react'
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

    const hoverTimeoutRef = useRef<number | null>(null)
    const OVERLAY_DELAY = 50

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const doc = iframe.contentDocument
        if (!doc) return

        function getNodeId(target: HTMLElement | null) {
            return target?.closest('[data-fui-id]')?.getAttribute('data-fui-id') ?? null
        }

        function handleMouseMove(e: MouseEvent) {
            const target = e.target as HTMLElement

            if (target.closest('[data-overlay-action="true"]')) {
                return
            }

            const nodeId = getNodeId(target)

            if (hoverTimeoutRef.current) {
                window.clearTimeout(hoverTimeoutRef.current)
            }

            hoverTimeoutRef.current = window.setTimeout(() => {
                if (!nodeId || nodeId === selectedNodeId) {
                    setHoveredNodeId(null)
                } else {
                    setHoveredNodeId(nodeId)
                }
            }, OVERLAY_DELAY)
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
            if (hoverTimeoutRef.current) {
                window.clearTimeout(hoverTimeoutRef.current)
            }
            setHoveredNodeId(null)
        }

        doc.addEventListener('mouseover', handleMouseMove)
        doc.addEventListener('click', handleClick)
        doc.addEventListener('mouseleave', handleLeave)

        return () => {
            doc.removeEventListener('mouseover', handleMouseMove)
            doc.removeEventListener('click', handleClick)
            doc.removeEventListener('mouseleave', handleLeave)
        }
    }, [iframeRef, version, selectedNodeId, setSelectedNodeId])

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const doc = iframe.contentDocument!
        if (!doc) return

        const win = doc.defaultView!
        if (!win) return

        doc.body.style.position = 'relative'

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

        function render() {
            root.innerHTML = ''

            const idsToRender = new Set<string>()

            if (selectedNodeId) idsToRender.add(selectedNodeId)
            if (hoveredNodeId && hoveredNodeId !== selectedNodeId) {
                idsToRender.add(hoveredNodeId)
            }

            if (idsToRender.size === 0) return

            idsToRender.forEach((id) => {
                const el = doc.querySelector(`[data-fui-id="${id}"]`) as HTMLElement | null
                if (!el) return

                const rect = el.getBoundingClientRect()
                const scrollX = win.scrollX
                const scrollY = win.scrollY

                const isSelected = selectedNodeId === id
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
                        if (type === 'delete') builder.remove(id)
                        if (type === 'copy') builder.copy(id)
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

                actionBar.dataset.overlayAction = 'true'
                actionBar.style.pointerEvents = 'auto'
                actionBar.style.position = 'absolute'
                actionBar.style.background = colors.border
                actionBar.style.borderRadius = '6px'

                root.appendChild(actionBar)
            })
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
