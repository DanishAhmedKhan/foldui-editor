import { useEffect } from 'react'
import { useEditorStore } from '../../store/useEditorStore'

interface Props {
    iframeRef: React.RefObject<HTMLIFrameElement | null>
}

export function useCanvasEmptyState({ iframeRef }: Props) {
    const version = useEditorStore((s) => s.version)
    const builder = useEditorStore((s) => s.builder)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe) return

        const doc = iframe.contentDocument!
        if (!doc) return

        // function isEditorEmptySlot(el: Element) {
        //     return el instanceof HTMLElement && el.dataset.fuiEmptySlot === 'true'
        // }

        // function isEmptyContainer(el: HTMLElement) {
        //     const realChildren = Array.from(el.children).filter((child) => !isEditorEmptySlot(child))
        //     return realChildren.length === 0
        // }

        function createEmptySlot(parentId: string) {
            const slot = doc.createElement('div')
            slot.dataset.fuiEmptySlot = 'true'
            slot.dataset.editorIgnore = 'true'

            Object.assign(slot.style, {
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #ddd',
                // background: 'rgba(0,0,0,0.02)',
                width: '100%',
                padding: '20px',
            })

            slot.style.transition = 'background 0.15s ease, border-color 0.15s ease'

            slot.onmouseenter = () => {
                slot.style.borderColor = '#3b82f6'
                slot.style.background = 'rgba(59,130,246,0.04)'
            }

            slot.onmouseleave = () => {
                slot.style.borderColor = '#ddd'
                slot.style.background = 'transparent'
            }

            const plus = doc.createElement('button')
            plus.innerText = '+'

            Object.assign(plus.style, {
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '2px dashed #ccc',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
            })

            plus.onmouseenter = () => {
                plus.style.borderColor = '#3b82f6'
                plus.style.background = '#eff6ff'
                plus.style.transform = 'scale(1.08)'
            }

            plus.onmouseleave = () => {
                plus.style.borderColor = '#ccc'
                plus.style.background = 'white'
                plus.style.transform = 'scale(1)'
            }

            plus.onclick = (e) => {
                e.stopPropagation()
                builder.add('text').into(parentId)
            }

            slot.appendChild(plus)

            return slot
        }

        function render() {
            const sections = Array.from(doc.querySelectorAll('[data-fui-type="section"]')) as HTMLElement[]

            sections.forEach((section) => {
                section.dataset.editorIgnore = 'true'

                const row = section.querySelector(':scope > [data-fui-type="container"]') as HTMLElement | null

                if (!row) return

                row.dataset.editorIgnore = 'true'

                const cols = Array.from(row.querySelectorAll(':scope > [data-fui-type="container"]')) as HTMLElement[]

                cols.forEach((col) => {
                    const parentId = col.getAttribute('data-fui-id')
                    if (!parentId) return

                    const existingSlot = Array.from(col.children).find(
                        (child) => child instanceof HTMLElement && child.dataset.fuiEmptySlot === 'true',
                    )

                    const realChildren = Array.from(col.children).filter(
                        (child) => !(child instanceof HTMLElement && child.dataset.fuiEmptySlot === 'true'),
                    )

                    const isEmpty = realChildren.length === 0

                    if (isEmpty) {
                        if (!existingSlot) {
                            const slot = createEmptySlot(parentId)
                            col.appendChild(slot)
                        }
                    } else {
                        if (existingSlot) {
                            existingSlot.remove()
                        }
                    }
                })
            })
        }
        render()
    }, [iframeRef, version, builder])
}
