// // import { useEffect, useRef, useState } from 'react'
// // import { createActionBar } from './overlay/createActionBar'
// // import { useEditorStore } from '../../store/useEditorStore'
// // import { icons } from '../../assets/icons'

// // interface Props {
// //     iframeRef: React.RefObject<HTMLIFrameElement | null>
// // }

// // const OVERLAY_COLORS = {
// //     hover: {
// //         border: 'dodgerblue',
// //         background: 'rgba(30,144,255,0.08)',
// //     },
// //     selected: {
// //         border: 'orange',
// //         background: 'rgba(255,165,0,0.08)',
// //     },
// // }

// // export function useCanvasOverlay({ iframeRef }: Props) {
// //     const builder = useEditorStore((s) => s.builder)

// //     const selectedNodeId = useEditorStore((s) => s.selectedNodeId)
// //     const setSelectedNodeId = useEditorStore((s) => s.setSelectedNodeId)

// //     const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

// //     const hoverTimeoutRef = useRef<number | null>(null)
// //     const OVERLAY_DELAY = 10

// //     useEffect(() => {
// //         const iframe = iframeRef.current
// //         if (!iframe) return

// //         const doc = iframe.contentDocument
// //         if (!doc) return

// //         function getNodeId(target: HTMLElement | null) {
// //             if (!target) return null

// //             if (target.closest('[data-editor-ignore="true"]')) {
// //                 return null
// //             }

// //             return target.closest('[data-fui-id]')?.getAttribute('data-fui-id') ?? null
// //         }

// //         function handleMouseMove(e: MouseEvent) {
// //             const target = e.target as HTMLElement

// //             if (target.closest('[data-overlay-action="true"]') || target.closest('[data-editor-ignore="true"]')) {
// //                 return
// //             }

// //             const nodeId = getNodeId(target)

// //             if (hoverTimeoutRef.current) {
// //                 window.clearTimeout(hoverTimeoutRef.current)
// //             }

// //             hoverTimeoutRef.current = window.setTimeout(() => {
// //                 if (!nodeId || nodeId === selectedNodeId) {
// //                     setHoveredNodeId(null)
// //                 } else {
// //                     setHoveredNodeId(nodeId)
// //                 }
// //             }, OVERLAY_DELAY)
// //         }

// //         function handleClick(e: MouseEvent) {
// //             const target = e.target as HTMLElement

// //             if (target.closest('[data-editor-ignore="true"]')) {
// //                 return
// //             }

// //             const nodeId = getNodeId(target)

// //             if (!nodeId) {
// //                 setSelectedNodeId(null)
// //                 return
// //             }

// //             e.preventDefault()
// //             e.stopPropagation()
// //             setSelectedNodeId(nodeId)
// //         }

// //         function handleLeave() {
// //             if (hoverTimeoutRef.current) {
// //                 window.clearTimeout(hoverTimeoutRef.current)
// //             }
// //             setHoveredNodeId(null)
// //         }

// //         doc.addEventListener('mousemove', handleMouseMove)
// //         doc.addEventListener('click', handleClick)
// //         doc.addEventListener('mouseleave', handleLeave)

// //         return () => {
// //             doc.removeEventListener('mousemove', handleMouseMove)
// //             doc.removeEventListener('click', handleClick)
// //             doc.removeEventListener('mouseleave', handleLeave)
// //         }
// //     }, [iframeRef, selectedNodeId, setSelectedNodeId])

// //     useEffect(() => {
// //         const iframe = iframeRef.current!
// //         if (!iframe) return

// //         const doc = iframe.contentDocument!
// //         if (!doc) return

// //         const win = doc.defaultView!
// //         if (!win) return

// //         let resizeObserver: ResizeObserver | null = null

// //         doc.body.style.position = 'relative'

// //         let root = doc.getElementById('__overlay_root__') as HTMLElement | null

// //         if (!root) {
// //             root = doc.createElement('div')
// //             root.id = '__overlay_root__'

// //             Object.assign(root.style, {
// //                 position: 'absolute',
// //                 inset: '0',
// //                 pointerEvents: 'none',
// //                 zIndex: '999999',
// //             })

// //             doc.body.appendChild(root)

// //             const hoverLayer = doc.createElement('div')
// //             hoverLayer.id = '__hover_layer__'
// //             hoverLayer.style.position = 'absolute'
// //             hoverLayer.style.inset = '0'
// //             hoverLayer.style.pointerEvents = 'none'

// //             const selectionLayer = doc.createElement('div')
// //             selectionLayer.id = '__selection_layer__'
// //             selectionLayer.style.position = 'absolute'
// //             selectionLayer.style.inset = '0'
// //             selectionLayer.style.pointerEvents = 'none'

// //             root.appendChild(hoverLayer)
// //             root.appendChild(selectionLayer)
// //         }

// //         const hoverLayer = doc.getElementById('__hover_layer__') as HTMLElement
// //         const selectionLayer = doc.getElementById('__selection_layer__') as HTMLElement

// //         function render() {
// //             hoverLayer.innerHTML = ''
// //             selectionLayer.innerHTML = ''

// //             const idsToRender = new Set<string>()

// //             if (hoveredNodeId) {
// //                 idsToRender.add(hoveredNodeId)
// //             }

// //             if (selectedNodeId) {
// //                 idsToRender.add(selectedNodeId)
// //             }

// //             idsToRender.forEach((id) => {
// //                 const el = doc.querySelector(`[data-fui-id="${id}"]`) as HTMLElement | null
// //                 if (!el) return

// //                 const rect = el.getBoundingClientRect()
// //                 const scrollX = win.scrollX
// //                 const scrollY = win.scrollY

// //                 const isSelected = selectedNodeId === id
// //                 const colors = isSelected ? OVERLAY_COLORS.selected : OVERLAY_COLORS.hover

// //                 const layer = isSelected ? selectionLayer : hoverLayer

// //                 const box = doc.createElement('div')

// //                 Object.assign(box.style, {
// //                     position: 'absolute',
// //                     top: rect.top + scrollY + 'px',
// //                     left: rect.left + scrollX + 'px',
// //                     width: rect.width + 'px',
// //                     height: rect.height + 'px',
// //                     border: `2px solid ${colors.border}`,
// //                     background: colors.background,
// //                     boxSizing: 'border-box',
// //                     pointerEvents: 'none',
// //                 })

// //                 layer.appendChild(box)

// //                 const actionBar = createActionBar(
// //                     doc,
// //                     {
// //                         ...rect,
// //                         top: rect.top + scrollY,
// //                         left: rect.left + scrollX,
// //                     } as DOMRect,
// //                     [{ type: 'copy' }, { type: 'move' }, { type: 'delete' }],
// //                     {
// //                         placement: 'top-left',
// //                         offset: 0,
// //                         outside: false,
// //                     },
// //                     'horizontal',
// //                     (type) => {
// //                         if (type === 'delete') builder.remove(id)
// //                         if (type === 'copy') builder.copy(id)
// //                         if (type === 'move') console.log('move')
// //                     },
// //                     {
// //                         background: colors.border,
// //                         iconColor: 'white',
// //                         iconBackground: 'transparent',
// //                         customIcons: {
// //                             delete: icons.delete,
// //                             copy: icons.copy,
// //                             move: icons.move,
// //                         },
// //                     },
// //                 )

// //                 actionBar.dataset.overlayAction = 'true'
// //                 actionBar.style.pointerEvents = 'auto'
// //                 actionBar.style.position = 'absolute'
// //                 actionBar.style.borderRadius = '6px'

// //                 layer.appendChild(actionBar)
// //             })
// //         }

// //         function observeSelected() {
// //             resizeObserver?.disconnect()

// //             if (!selectedNodeId) return

// //             const el = doc.querySelector(`[data-fui-id="${selectedNodeId}"]`) as HTMLElement | null
// //             console.log(el)
// //             if (!el) return

// //             resizeObserver = new ResizeObserver(() => {
// //                 render()
// //             })

// //             resizeObserver.observe(el)
// //         }

// //         render()
// //         observeSelected()

// //         win.addEventListener('scroll', render)
// //         win.addEventListener('resize', render)

// //         return () => {
// //             win.removeEventListener('scroll', render)
// //             win.removeEventListener('resize', render)
// //             resizeObserver?.disconnect()
// //         }
// //     }, [iframeRef, selectedNodeId, hoveredNodeId, builder])
// // }

// import { useEffect, useRef, useState } from 'react'
// import { createActionBar } from './overlay/createActionBar'
// import { useEditorStore } from '../../store/useEditorStore'
// import { icons } from '../../assets/icons'
// import { createOverlayEngine } from './createOverlayEngine'

// interface Props {
//     iframeRef: React.RefObject<HTMLIFrameElement | null>
// }

// export function useCanvasOverlay({ iframeRef }: Props) {
//     const builder = useEditorStore((s) => s.builder)

//     const selectedNodeId = useEditorStore((s) => s.selectedNodeId)
//     const setSelectedNodeId = useEditorStore((s) => s.setSelectedNodeId)

//     const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)

//     const engineRef = useRef<any>(null)

//     const hoverTimeoutRef = useRef<number | null>(null)
//     const OVERLAY_DELAY = 10

//     useEffect(() => {
//         const iframe = iframeRef.current
//         if (!iframe) return

//         const doc = iframe.contentDocument
//         if (!doc) return

//         engineRef.current = createOverlayEngine(doc)
//     }, [iframeRef])

//     useEffect(() => {
//         const iframe = iframeRef.current
//         if (!iframe) return

//         const doc = iframe.contentDocument
//         if (!doc) return

//         function getNodeId(target: HTMLElement | null) {
//             if (!target) return null

//             if (target.closest('[data-editor-ignore="true"]')) return null

//             return target.closest('[data-fui-id]')?.getAttribute('data-fui-id') ?? null
//         }

//         function handleMouseMove(e: MouseEvent) {
//             const target = e.target as HTMLElement

//             if (target.closest('[data-overlay-action="true"]') || target.closest('[data-editor-ignore="true"]')) {
//                 return
//             }

//             const nodeId = getNodeId(target)

//             if (hoverTimeoutRef.current) {
//                 window.clearTimeout(hoverTimeoutRef.current)
//             }

//             hoverTimeoutRef.current = window.setTimeout(() => {
//                 if (!nodeId || nodeId === selectedNodeId) {
//                     setHoveredNodeId(null)
//                 } else {
//                     setHoveredNodeId(nodeId)
//                 }
//             }, OVERLAY_DELAY)
//         }

//         function handleClick(e: MouseEvent) {
//             const target = e.target as HTMLElement

//             if (target.closest('[data-editor-ignore="true"]')) return

//             const nodeId = getNodeId(target)

//             if (!nodeId) {
//                 setSelectedNodeId(null)
//                 return
//             }

//             e.preventDefault()
//             e.stopPropagation()

//             setSelectedNodeId(nodeId)
//         }

//         function handleLeave() {
//             if (hoverTimeoutRef.current) {
//                 window.clearTimeout(hoverTimeoutRef.current)
//             }

//             setHoveredNodeId(null)
//         }

//         doc.addEventListener('mousemove', handleMouseMove)
//         doc.addEventListener('click', handleClick)
//         doc.addEventListener('mouseleave', handleLeave)

//         return () => {
//             doc.removeEventListener('mousemove', handleMouseMove)
//             doc.removeEventListener('click', handleClick)
//             doc.removeEventListener('mouseleave', handleLeave)
//         }
//     }, [iframeRef, selectedNodeId, setSelectedNodeId])

//     useEffect(() => {
//         const engine = engineRef.current
//         if (!engine) return

//         engine.clear()

//         if (hoveredNodeId) {
//             engine.show(hoveredNodeId)
//         }

//         if (selectedNodeId) {
//             engine.show(selectedNodeId)
//         }
//     }, [hoveredNodeId, selectedNodeId])

//     useEffect(() => {
//         const iframe = iframeRef.current
//         if (!iframe) return

//         const doc = iframe.contentDocument!
//         if (!doc) return

//         const win = doc.defaultView!
//         if (!win) return

//         let actionBar: HTMLElement | null = null

//         function renderActionBar() {
//             if (!selectedNodeId) {
//                 actionBar?.remove()
//                 actionBar = null
//                 return
//             }

//             const el = doc.querySelector(`[data-fui-id="${selectedNodeId}"]`) as HTMLElement | null
//             if (!el) return

//             const rect = el.getBoundingClientRect()

//             actionBar?.remove()

//             actionBar = createActionBar(
//                 doc,
//                 {
//                     ...rect,
//                     top: rect.top + win.scrollY,
//                     left: rect.left + win.scrollX,
//                 } as DOMRect,
//                 [{ type: 'copy' }, { type: 'move' }, { type: 'delete' }],
//                 {
//                     placement: 'top-left',
//                     offset: 0,
//                     outside: false,
//                 },
//                 'horizontal',
//                 (type) => {
//                     if (type === 'delete') builder.remove(selectedNodeId)
//                     if (type === 'copy') builder.copy(selectedNodeId)
//                 },
//                 {
//                     background: 'orange',
//                     iconColor: 'white',
//                     iconBackground: 'transparent',
//                     customIcons: {
//                         delete: icons.delete,
//                         copy: icons.copy,
//                         move: icons.move,
//                     },
//                 },
//             )

//             actionBar.dataset.overlayAction = 'true'
//             actionBar.style.pointerEvents = 'auto'
//             actionBar.style.position = 'absolute'
//             actionBar.style.borderRadius = '6px'

//             // doc.body.appendChild(actionBar)

//             const overlay = engineRef.current?.getOverlay(selectedNodeId)

//             if (overlay) {
//                 overlay.appendChild(actionBar)
//             }
//         }

//         renderActionBar()

//         win.addEventListener('scroll', renderActionBar)
//         win.addEventListener('resize', renderActionBar)

//         return () => {
//             win.removeEventListener('scroll', renderActionBar)
//             win.removeEventListener('resize', renderActionBar)
//             actionBar?.remove()
//         }
//     }, [selectedNodeId, builder, iframeRef])
// }

import { useEffect, useRef } from 'react'
import { useEditorStore } from '../../store/useEditorStore'
import { OverlayManager } from './OverlayManager'

export function useCanvasOverlay(iframeRef: React.RefObject<HTMLIFrameElement>) {
    const overlayManagerRef = useRef<OverlayManager | null>(null)

    const selectedNodeId = useEditorStore((s) => s.selectedNodeId)
    const setSelectedNodeId = useEditorStore((s) => s.setSelectedNodeId)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const doc = iframe.contentDocument
        if (!doc) return

        overlayManagerRef.current = new OverlayManager(doc)

        function getNodeId(target: HTMLElement | null) {
            if (!target) return null

            if (target.closest('[data-editor-ignore="true"]')) return null

            return target.closest('[data-fui-id]')?.getAttribute('data-fui-id') ?? null
        }

        function handleMouseMove(e: MouseEvent) {
            const target = e.target as HTMLElement

            const id = getNodeId(target)

            overlayManagerRef.current?.setHover(id)
        }

        function handleClick(e: MouseEvent) {
            const target = e.target as HTMLElement

            const id = getNodeId(target)

            if (!id) return

            e.preventDefault()
            e.stopPropagation()

            setSelectedNodeId(id)

            overlayManagerRef.current?.setSelected(id)
        }

        doc.addEventListener('mousemove', handleMouseMove)
        doc.addEventListener('click', handleClick)

        return () => {
            doc.removeEventListener('mousemove', handleMouseMove)
            doc.removeEventListener('click', handleClick)

            overlayManagerRef.current?.destroy()
        }
    }, [iframeRef])

    useEffect(() => {
        overlayManagerRef.current?.setSelected(selectedNodeId)
    }, [selectedNodeId])
}
