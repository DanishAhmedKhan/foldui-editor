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
        let hiddenSlot: HTMLElement | null = null
        let lastParentId: string | null = null
        let lastIndex: number | null = null

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

        function createEmptySlot() {
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
            return Array.from(col.children).filter((c) => {
                const el = c as HTMLElement
                return !el.dataset.fuiPlaceholder && !el.dataset.fuiEmptySlot
            })
        }

        function ensureEmptySlot(col: HTMLElement) {
            const realChildren = getRealChildren(col)
            const existingSlot = col.querySelector('[data-fui-empty-slot="true"]')

            if (realChildren.length === 0 && !existingSlot) {
                col.appendChild(createEmptySlot())
            }

            if (realChildren.length > 0 && existingSlot) {
                ;(existingSlot as HTMLElement).style.display = 'none'
            }
        }

        function restoreSlot() {
            if (!hiddenSlot) return
            hiddenSlot.style.visibility = ''
            hiddenSlot.style.pointerEvents = ''
            hiddenSlot = null
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
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'copy'
            }

            const target = e.target as HTMLElement

            const col = target.closest(
                '[data-fui-type="section"] > [data-fui-type="container"] > [data-fui-type="container"][data-fui-id]',
            ) as HTMLElement | null

            if (!col) {
                restoreSlot()
                removePlaceholder()
                currentCol = null
                lastParentId = null
                lastIndex = null
                return
            }

            const parentId = col.dataset.fuiId
            if (!parentId) return

            const realChildren = getRealChildren(col)

            let newIndex = realChildren.length

            for (let i = 0; i < realChildren.length; i++) {
                const rect = realChildren[i].getBoundingClientRect()
                const middle = rect.top + rect.height / 2
                if (e.clientY < middle) {
                    newIndex = i
                    break
                }
            }

            if (parentId === lastParentId && newIndex === lastIndex) return

            if (currentCol && currentCol !== col) {
                restoreSlot()
            }

            currentCol = col
            lastParentId = parentId
            lastIndex = newIndex

            ensureEmptySlot(col)

            const ph = createPlaceholder()

            const slot = col.querySelector('[data-fui-empty-slot="true"]') as HTMLElement | null

            if (slot && realChildren.length === 0) {
                hiddenSlot = slot
                slot.style.visibility = 'hidden'
                slot.style.pointerEvents = 'none'
                col.insertBefore(ph, slot)
                return
            }

            if (newIndex >= realChildren.length) {
                col.appendChild(ph)
            } else {
                col.insertBefore(ph, realChildren[newIndex])
            }
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
            hiddenSlot = null
            stopDragging()

            currentCol = null
            lastParentId = null
            lastIndex = null

            setTimeout(renderEmptyStates, 0)
        }

        function handleDragEnd() {
            restoreSlot()
            removePlaceholder()

            currentCol = null
            lastParentId = null
            lastIndex = null

            stopDragging()
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
    }, [iframeRef, version, draggingElement, addElement, stopDragging])
}
