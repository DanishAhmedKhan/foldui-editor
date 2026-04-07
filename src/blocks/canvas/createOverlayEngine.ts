// export const createOverlayEngine = (doc: Document) => {
//     const boxes = new Map<string, HTMLElement>()
//     let running = false

//     const win = doc.defaultView!

//     function ensureBox(id: string) {
//         if (boxes.has(id)) return boxes.get(id)!

//         const box = doc.createElement('div')

//         Object.assign(box.style, {
//             position: 'absolute',
//             border: '2px solid orange',
//             pointerEvents: 'none',
//             boxSizing: 'border-box',
//         })

//         doc.body.appendChild(box)

//         boxes.set(id, box)
//         return box
//     }

//     function removeBox(id: string) {
//         const box = boxes.get(id)
//         if (!box) return

//         box.remove()
//         boxes.delete(id)
//     }

//     function update(id: string) {
//         const el = doc.querySelector(`[data-fui-id="${id}"]`) as HTMLElement | null
//         if (!el) return

//         const rect = el.getBoundingClientRect()
//         const box = ensureBox(id)

//         Object.assign(box.style, {
//             top: rect.top + win.scrollY + 'px',
//             left: rect.left + win.scrollX + 'px',
//             width: rect.width + 'px',
//             height: rect.height + 'px',
//         })
//     }

//     function loop() {
//         boxes.forEach((_, id) => update(id))

//         if (boxes.size === 0) {
//             running = false
//             return
//         }

//         requestAnimationFrame(loop)
//     }

//     function clear() {
//         boxes.forEach((box) => box.remove())
//         boxes.clear()
//         running = false
//     }

//     return {
//         show(id: string) {
//             ensureBox(id)

//             if (!running) {
//                 running = true
//                 requestAnimationFrame(loop)
//             }
//         },

//         hide(id: string) {
//             removeBox(id)

//             if (boxes.size === 0) {
//                 running = false
//             }
//         },

//         clear,
//     }
// }

export const createOverlayEngine = (doc: Document) => {
    const win = doc.defaultView!
    const overlays = new Map<string, HTMLElement>()
    let running = false

    function createLayer(color: string) {
        const el = doc.createElement('div')

        Object.assign(el.style, {
            position: 'absolute',
            pointerEvents: 'none',
            boxSizing: 'border-box',
            background: color,
        })

        return el
    }

    function ensureOverlay(id: string) {
        if (overlays.has(id)) return overlays.get(id)!

        const wrapper = doc.createElement('div')

        Object.assign(wrapper.style, {
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: '999999',
        })

        // const margin = createLayer('rgba(255, 155, 0, 0.25)')
        const margin = createLayer('transparent')
        // const border = createLayer('rgba(255, 200, 50, 0.35)')
        const border = createLayer('transparent')
        // const padding = createLayer('rgba(0, 0, 255, 0.1)')
        const padding = createLayer('transparent')
        const content = createLayer('rgba(255, 0, 0, 0.1)')

        wrapper.append(margin, border, padding, content)

        doc.body.appendChild(wrapper)

        overlays.set(id, wrapper)

        return wrapper
    }

    function removeOverlay(id: string) {
        const el = overlays.get(id)
        if (!el) return

        el.remove()
        overlays.delete(id)
    }

    function update(id: string) {
        const el = doc.querySelector(`[data-fui-id="${id}"]`) as HTMLElement | null
        if (!el) return

        const wrapper = ensureOverlay(id)

        const rect = el.getBoundingClientRect()
        const style = win.getComputedStyle(el)

        const margin = {
            top: parseFloat(style.marginTop),
            right: parseFloat(style.marginRight),
            bottom: parseFloat(style.marginBottom),
            left: parseFloat(style.marginLeft),
        }

        const border = {
            top: parseFloat(style.borderTopWidth),
            right: parseFloat(style.borderRightWidth),
            bottom: parseFloat(style.borderBottomWidth),
            left: parseFloat(style.borderLeftWidth),
        }

        const padding = {
            top: parseFloat(style.paddingTop),
            right: parseFloat(style.paddingRight),
            bottom: parseFloat(style.paddingBottom),
            left: parseFloat(style.paddingLeft),
        }

        const layers = wrapper.children

        const marginBox = layers[0] as HTMLElement
        const borderBox = layers[1] as HTMLElement
        const paddingBox = layers[2] as HTMLElement
        const contentBox = layers[3] as HTMLElement

        const top = rect.top + win.scrollY
        const left = rect.left + win.scrollX

        Object.assign(wrapper.style, {
            top: top - margin.top + 'px',
            left: left - margin.left + 'px',
            width: rect.width + margin.left + margin.right + 'px',
            height: rect.height + margin.top + margin.bottom + 'px',
        })

        Object.assign(marginBox.style, {
            top: '0px',
            left: '0px',
            width: '100%',
            height: '100%',
        })

        Object.assign(borderBox.style, {
            top: margin.top + 'px',
            left: margin.left + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px',
        })

        Object.assign(paddingBox.style, {
            top: margin.top + border.top + 'px',
            left: margin.left + border.left + 'px',
            width: rect.width - border.left - border.right + 'px',
            height: rect.height - border.top - border.bottom + 'px',
        })

        Object.assign(contentBox.style, {
            top: margin.top + border.top + padding.top + 'px',
            left: margin.left + border.left + padding.left + 'px',
            width: rect.width - border.left - border.right - padding.left - padding.right + 'px',
            height: rect.height - border.top - border.bottom - padding.top - padding.bottom + 'px',
        })
    }

    function loop() {
        overlays.forEach((_, id) => update(id))

        if (overlays.size === 0) {
            running = false
            return
        }

        requestAnimationFrame(loop)
    }

    function getOverlay(id: string) {
        return overlays.get(id) ?? null
    }

    function clear() {
        overlays.forEach((el) => el.remove())
        overlays.clear()
        running = false
    }

    return {
        show(id: string) {
            ensureOverlay(id)

            if (!running) {
                running = true
                requestAnimationFrame(loop)
            }
        },

        hide(id: string) {
            removeOverlay(id)

            if (overlays.size === 0) {
                running = false
            }
        },

        clear,
        getOverlay,
    }
}
