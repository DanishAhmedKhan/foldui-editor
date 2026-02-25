// import { useEffect } from 'react'
// import { useEditorStore } from '../../store/useEditorStore'

// interface Props {
//     iframeRef: React.RefObject<HTMLIFrameElement | null>
// }

// export function useCanvasEmptyState({ iframeRef }: Props) {
//     const version = useEditorStore((s) => s.version)
//     const builder = useEditorStore((s) => s.builder)

//     useEffect(() => {
//         const iframe = iframeRef.current
//         if (!iframe) return

//         const doc = iframe.contentDocument!
//         if (!doc) return

//         const win = doc.defaultView!
//         if (!win) return

//         const root = doc.getElementById('__overlay_root__')!
//         if (!root) return

//         function isEmptyContainer(el: HTMLElement) {
//             return el.children.length === 0
//         }

//         function render() {
//             const containers = Array.from(
//                 doc.querySelectorAll(
//                     '[data-fui-type="section"] > [data-fui-type="container"] > [data-fui-type="container"]',
//                 ),
//             ) as HTMLElement[]

//             containers.forEach((el) => {
//                 if (!isEmptyContainer(el)) return

//                 const rect = el.getBoundingClientRect()

//                 const plus = doc.createElement('button')
//                 plus.innerText = '+'
//                 plus.dataset.editorIgnore = 'true'

//                 Object.assign(plus.style, {
//                     position: 'absolute',
//                     top: rect.top + win.scrollY + rect.height / 2 + 'px',
//                     left: rect.left + win.scrollX + rect.width / 2 + 'px',
//                     transform: 'translate(-50%, -50%)',
//                     width: '36px',
//                     height: '36px',
//                     borderRadius: '50%',
//                     border: '2px dashed #ccc',
//                     background: 'white',
//                     cursor: 'pointer',
//                     zIndex: '1000000',
//                 })

//                 const parentId = el.getAttribute('data-fui-id')
//                 if (!parentId) return
//                 plus.onclick = (e) => {
//                     e.stopPropagation()
//                     builder.add('text').into(parentId)
//                 }

//                 root.appendChild(plus)
//             })
//         }

//         render()
//         win.addEventListener('scroll', render)
//         win.addEventListener('resize', render)

//         return () => {
//             win.removeEventListener('scroll', render)
//             win.removeEventListener('resize', render)
//         }
//     }, [iframeRef, version, builder])
// }

import { useEffect } from 'react'
import { useEditorStore } from '../../store/useEditorStore'

interface Props {
    iframeRef: React.RefObject<HTMLIFrameElement | null>
}

export function useCanvasEmptyState({ iframeRef }: Props) {
    const version = useEditorStore((s) => s.version)
    const builder = useEditorStore((s) => s.builder)

    useEffect(() => {
        const iframe = iframeRef.current!
        if (!iframe) return

        const doc = iframe.contentDocument!
        if (!doc) return

        const win = doc.defaultView!
        if (!win) return

        const root = doc.getElementById('__overlay_root__')!
        if (!root) return

        // ✅ ensure empty layer exists
        let emptyLayer = doc.getElementById('__empty_layer__') as HTMLElement | null

        if (!emptyLayer) {
            emptyLayer = doc.createElement('div')
            emptyLayer.id = '__empty_layer__'

            Object.assign(emptyLayer.style, {
                position: 'absolute',
                inset: '0',
                pointerEvents: 'none',
                zIndex: '999998', // below hover & selection
            })

            root.prepend(emptyLayer)
        }

        function isEmptyContainer(el: HTMLElement) {
            return el.children.length === 0
        }

        function render() {
            emptyLayer!.innerHTML = '' // ✅ only clear empty layer

            const containers = Array.from(
                doc.querySelectorAll(
                    '[data-fui-type="section"] > [data-fui-type="container"] > [data-fui-type="container"]',
                ),
            ) as HTMLElement[]

            containers.forEach((el) => {
                if (!isEmptyContainer(el)) return

                const rect = el.getBoundingClientRect()

                const plus = doc.createElement('button')
                plus.innerText = '+'
                plus.dataset.editorIgnore = 'true'

                Object.assign(plus.style, {
                    position: 'absolute',
                    top: rect.top + win.scrollY + rect.height / 2 + 'px',
                    left: rect.left + win.scrollX + rect.width / 2 + 'px',
                    transform: 'translate(-50%, -50%)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '2px dashed #ccc',
                    background: 'white',
                    cursor: 'pointer',
                    pointerEvents: 'auto', // ✅ important
                })

                const parentId = el.getAttribute('data-fui-id')
                if (!parentId) return

                plus.onclick = (e) => {
                    e.stopPropagation()
                    builder.add('text').into(parentId)
                }

                emptyLayer!.appendChild(plus)
            })
        }

        render()
        win.addEventListener('scroll', render)
        win.addEventListener('resize', render)

        return () => {
            win.removeEventListener('scroll', render)
            win.removeEventListener('resize', render)
        }
    }, [iframeRef, version, builder])
}
