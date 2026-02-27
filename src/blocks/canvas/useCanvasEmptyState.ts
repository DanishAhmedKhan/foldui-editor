// import { useEffect } from 'react'
// import { useEditorStore } from '../../store/useEditorStore'

// interface Props {
//     iframeRef: React.RefObject<HTMLIFrameElement | null>
// }

// export function useCanvasEmptyState({ iframeRef }: Props) {
//     const version = useEditorStore((s) => s.version)
//     const builder = useEditorStore((s) => s.builder)
//     const addElement = useEditorStore((s) => s.addElement)
//     const draggingElement = useEditorStore((s) => s.draggingElement)
//     const stopDragging = useEditorStore((s) => s.stopDragging)

//     useEffect(() => {
//         const iframe = iframeRef.current
//         if (!iframe) return

//         const doc = iframe.contentDocument!
//         if (!doc) return

//         let placeholder: HTMLElement | null = null

//         function createPlaceholder() {
//             if (placeholder) return placeholder

//             const el = doc.createElement('div')
//             el.dataset.fuiPlaceholder = 'true'
//             el.dataset.editorIgnore = 'true'

//             Object.assign(el.style, {
//                 height: '8px',
//                 background: '#3b82f6',
//                 // background: 'red',
//                 borderRadius: '2px',
//                 margin: '6px 0',
//                 width: '100%',
//             })

//             placeholder = el
//             return el
//         }

//         function removePlaceholder() {
//             if (placeholder && placeholder.parentElement) {
//                 placeholder.remove()
//             }
//         }

//         function createEmptySlot(parentId: string) {
//             const slot = doc.createElement('div')
//             slot.dataset.fuiEmptySlot = 'true'
//             slot.dataset.editorIgnore = 'true'

//             Object.assign(slot.style, {
//                 minHeight: '40px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 border: '1px dashed #ddd',
//                 width: '100%',
//                 padding: '20px',
//             })

//             const plus = doc.createElement('button')
//             plus.innerText = '+'

//             Object.assign(plus.style, {
//                 width: '36px',
//                 height: '36px',
//                 borderRadius: '50%',
//                 border: '2px dashed #ccc',
//                 background: 'white',
//                 cursor: 'pointer',
//             })

//             plus.onclick = (e) => {
//                 e.stopPropagation()
//                 builder.add('text').into(parentId)
//             }

//             slot.appendChild(plus)
//             return slot
//         }

//         function renderEmptyStates() {
//             const sections = Array.from(doc.querySelectorAll('[data-fui-type="section"]')) as HTMLElement[]

//             sections.forEach((section) => {
//                 section.dataset.editorIgnore = 'true'

//                 const row = section.querySelector(':scope > [data-fui-type="container"]') as HTMLElement | null

//                 if (!row) return
//                 row.dataset.editorIgnore = 'true'

//                 const cols = Array.from(row.querySelectorAll(':scope > [data-fui-type="container"]')) as HTMLElement[]

//                 cols.forEach((col) => {
//                     const parentId = col.getAttribute('data-fui-id')
//                     if (!parentId) return

//                     const existingSlot = Array.from(col.children).find(
//                         (child) => child instanceof HTMLElement && child.dataset.fuiEmptySlot === 'true',
//                     )

//                     const realChildren = Array.from(col.children).filter(
//                         (child) =>
//                             !(
//                                 child instanceof HTMLElement &&
//                                 (child.dataset.fuiEmptySlot === 'true' || child.dataset.fuiPlaceholder === 'true')
//                             ),
//                     )

//                     if (realChildren.length === 0) {
//                         if (!existingSlot) {
//                             col.appendChild(createEmptySlot(parentId))
//                         }
//                     } else {
//                         if (existingSlot) existingSlot.remove()
//                     }
//                 })
//             })
//         }

//         function handleDragOver(e: DragEvent) {
//             if (!draggingElement) return

//             e.preventDefault()

//             const target = e.target as HTMLElement

//             const col = target.closest(
//                 '[data-fui-type="container"]:not([data-editor-ignore="true"])',
//             ) as HTMLElement | null

//             if (!col) {
//                 removePlaceholder()
//                 return
//             }

//             const children = Array.from(col.children).filter(
//                 (c) => !(c as HTMLElement).dataset.fuiPlaceholder && !(c as HTMLElement).dataset.fuiEmptySlot,
//             )

//             const ph = createPlaceholder()

//             if (children.length === 0) {
//                 col.appendChild(ph)
//                 return
//             }

//             for (const child of children) {
//                 const rect = child.getBoundingClientRect()
//                 const middle = rect.top + rect.height / 2

//                 if (e.clientY < middle) {
//                     col.insertBefore(ph, child)
//                     return
//                 }
//             }

//             col.appendChild(ph)
//         }

//         function handleDrop(e: DragEvent) {
//             if (!draggingElement) return
//             e.preventDefault()

//             if (!placeholder) return

//             const col = placeholder.closest('[data-fui-type="container"]') as HTMLElement | null

//             if (!col) return

//             const parentId = col.dataset.fuiId
//             if (!parentId) return

//             const index = Array.from(col.children).indexOf(placeholder)

//             addElement(draggingElement.elementDefinition, parentId, index)

//             removePlaceholder()
//             stopDragging()
//         }

//         function handleDragLeave(e: DragEvent) {
//             if (!doc.body.contains(e.relatedTarget as Node)) {
//                 removePlaceholder()
//             }
//         }

//         doc.addEventListener('dragover', handleDragOver)
//         doc.addEventListener('drop', handleDrop)
//         doc.addEventListener('dragleave', handleDragLeave)

//         renderEmptyStates()

//         return () => {
//             doc.removeEventListener('dragover', handleDragOver)
//             doc.removeEventListener('drop', handleDrop)
//             doc.removeEventListener('dragleave', handleDragLeave)
//         }
//     }, [iframeRef, version, builder, draggingElement, addElement, stopDragging])
// }

import { useEffect } from 'react'
import { useEditorStore } from '../../store/useEditorStore'

interface Props {
    iframeRef: React.RefObject<HTMLIFrameElement | null>
}

export function useCanvasEmptyState({ iframeRef }: Props) {
    const version = useEditorStore((s) => s.version)
    const builder = useEditorStore((s) => s.builder)
    const addElement = useEditorStore((s) => s.addElement)
    const draggingElement = useEditorStore((s) => s.draggingElement)
    const stopDragging = useEditorStore((s) => s.stopDragging)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const doc = iframe.contentDocument
        if (!doc) return

        let placeholder: HTMLElement | null = null
        let currentCol: HTMLElement | null = null

        function createPlaceholder() {
            if (placeholder) return placeholder

            const el = doc.createElement('div')
            el.dataset.fuiPlaceholder = 'true'
            el.dataset.editorIgnore = 'true'

            Object.assign(el.style, {
                height: '8px',
                background: '#3b82f6',
                borderRadius: '2px',
                margin: '6px 0',
                width: '100%',
            })

            placeholder = el
            return el
        }

        function removePlaceholder() {
            if (placeholder?.parentElement) {
                placeholder.remove()
            }
        }

        function createEmptySlot(parentId: string) {
            const slot = doc.createElement('div')
            slot.dataset.fuiEmptySlot = 'true'
            slot.dataset.editorIgnore = 'true'

            Object.assign(slot.style, {
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #ddd',
                width: '100%',
                padding: '20px',
            })

            const plus = doc.createElement('button')
            plus.innerText = '+'

            Object.assign(plus.style, {
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '2px dashed #ccc',
                background: 'white',
                cursor: 'pointer',
            })

            plus.onclick = (e) => {
                e.stopPropagation()
                builder.add('text').into(parentId)
            }

            slot.appendChild(plus)
            return slot
        }

        function ensureEmptySlot(col: HTMLElement) {
            const parentId = col.dataset.fuiId
            if (!parentId) return

            const realChildren = Array.from(col.children).filter(
                (c) => !(c as HTMLElement).dataset.fuiPlaceholder && !(c as HTMLElement).dataset.fuiEmptySlot,
            )

            const existingSlot = col.querySelector('[data-fui-empty-slot="true"]')

            if (realChildren.length === 0 && !existingSlot) {
                col.appendChild(createEmptySlot(parentId))
            }
        }

        function removeEmptySlot(col: HTMLElement) {
            const slot = col.querySelector('[data-fui-empty-slot="true"]')
            if (slot) slot.remove()
        }

        function restorePreviousColumn() {
            if (currentCol) {
                removePlaceholder()
                ensureEmptySlot(currentCol)
                currentCol = null
            }
        }

        function renderEmptyStates() {
            const cols = Array.from(
                doc.querySelectorAll(
                    '[data-fui-type="section"] > [data-fui-type="container"] > [data-fui-type="container"]',
                ),
            ) as HTMLElement[]

            cols.forEach((col) => {
                ensureEmptySlot(col)
            })
        }

        function handleDragOver(e: DragEvent) {
            if (!draggingElement) return

            e.preventDefault()

            const target = e.target as HTMLElement

            const col = target.closest(
                '[data-fui-type="section"] [data-fui-type="container"][data-fui-id]',
            ) as HTMLElement | null

            if (!col) {
                restorePreviousColumn()
                return
            }

            if (currentCol !== col) {
                restorePreviousColumn()
                currentCol = col
                removeEmptySlot(col)
            }

            const children = Array.from(col.children).filter(
                (c) => !(c as HTMLElement).dataset.fuiPlaceholder && !(c as HTMLElement).dataset.fuiEmptySlot,
            )

            const ph = createPlaceholder()

            if (children.length === 0) {
                col.appendChild(ph)
                return
            }

            for (const child of children) {
                const rect = child.getBoundingClientRect()
                const middle = rect.top + rect.height / 2

                if (e.clientY < middle) {
                    col.insertBefore(ph, child)
                    return
                }
            }

            col.appendChild(ph)
        }

        function handleDrop(e: DragEvent) {
            if (!draggingElement) return
            e.preventDefault()

            if (!placeholder) return

            const col = placeholder.closest('[data-fui-id]') as HTMLElement | null
            if (!col) return

            const parentId = col.dataset.fuiId
            if (!parentId) return

            const index = Array.from(col.children).indexOf(placeholder)

            addElement(draggingElement.elementDefinition, parentId, index)

            removePlaceholder()
            stopDragging()
            currentCol = null
            renderEmptyStates()
        }

        function handleDragEnd() {
            restorePreviousColumn()
        }

        doc.addEventListener('dragover', handleDragOver)
        doc.addEventListener('drop', handleDrop)
        doc.addEventListener('dragend', handleDragEnd)

        renderEmptyStates()

        return () => {
            doc.removeEventListener('dragover', handleDragOver)
            doc.removeEventListener('drop', handleDrop)
            doc.removeEventListener('dragend', handleDragEnd)
        }
    }, [iframeRef, version, builder, draggingElement, addElement, stopDragging])
}
