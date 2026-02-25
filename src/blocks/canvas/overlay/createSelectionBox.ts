export function createSelectionBox(doc: Document, rect: DOMRect) {
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

    return box
}
