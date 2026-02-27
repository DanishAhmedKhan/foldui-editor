import { useEffect } from 'react'
import { useEditorStore } from '../../store/useEditorStore'

interface Props {
    iframeRef: React.RefObject<HTMLIFrameElement | null>
}

export function useCanvasEmptyState({ iframeRef }: Props) {
    const version = useEditorStore((s) => s.version)
    const addElement = useEditorStore((s) => s.addElement)
    const draggingElement = useEditorStore((s) => s.draggingElement)
    const stopDragging = useEditorStore((s) => s.stopDragging)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const doc = iframe.contentDocument!
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

            slot.appendChild(plus)
            return slot
        }

        function getRealChildren(col: HTMLElement) {
            return Array.from(col.children).filter(
                (c) => !(c as HTMLElement).dataset.fuiPlaceholder && !(c as HTMLElement).dataset.fuiEmptySlot,
            )
        }

        function ensureEmptySlot(col: HTMLElement) {
            const parentId = col.dataset.fuiId
            if (!parentId) return

            const realChildren = getRealChildren(col)
            const existingSlot = col.querySelector('[data-fui-empty-slot="true"]')

            if (realChildren.length === 0 && !existingSlot) {
                col.appendChild(createEmptySlot(parentId))
            }
        }

        function restoreColumn(col: HTMLElement | null) {
            if (!col) return
            removePlaceholder()
            ensureEmptySlot(col)
        }

        function renderEmptyStates() {
            const cols = Array.from(
                doc.querySelectorAll(
                    '[data-fui-type="section"] > [data-fui-type="container"] > [data-fui-type="container"]',
                ),
            ) as HTMLElement[]

            cols.forEach((col) => ensureEmptySlot(col))
        }

        function handleDragOver(e: DragEvent) {
            if (!draggingElement) return
            e.preventDefault()

            const target = e.target as HTMLElement

            const col = target.closest(
                '[data-fui-type="section"] > [data-fui-type="container"] > [data-fui-type="container"][data-fui-id]',
            ) as HTMLElement | null

            if (!col) {
                if (currentCol) {
                    restoreColumn(currentCol)
                    currentCol = null
                }
                return
            }

            if (currentCol && currentCol !== col) {
                restoreColumn(currentCol)
                currentCol = null
            }

            if (!currentCol) {
                currentCol = col
            }

            const realChildren = getRealChildren(col)
            const ph = createPlaceholder()

            const slot = col.querySelector('[data-fui-empty-slot="true"]')
            if (slot) slot.remove()

            if (realChildren.length === 0) {
                col.appendChild(ph)
                return
            }

            for (const child of realChildren) {
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

            addElement(draggingElement.elementDefinition as any, parentId, index)

            removePlaceholder()
            stopDragging()
            currentCol = null

            setTimeout(renderEmptyStates, 0)
        }

        function handleDragLeave(e: DragEvent) {
            const related = e.relatedTarget as Node | null
            if (!related || !doc.contains(related)) {
                restoreColumn(currentCol)
                currentCol = null
            }
        }

        function handleDragEnd() {
            restoreColumn(currentCol)
            currentCol = null
            stopDragging()
        }

        doc.addEventListener('dragover', handleDragOver)
        doc.addEventListener('drop', handleDrop)
        doc.addEventListener('dragleave', handleDragLeave)
        doc.addEventListener('dragend', handleDragEnd)

        renderEmptyStates()

        return () => {
            doc.removeEventListener('dragover', handleDragOver)
            doc.removeEventListener('drop', handleDrop)
            doc.removeEventListener('dragleave', handleDragLeave)
            doc.removeEventListener('dragend', handleDragEnd)
        }
    }, [iframeRef, version, draggingElement, addElement, stopDragging])
}
