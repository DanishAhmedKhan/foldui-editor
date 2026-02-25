export function createIcon(doc: Document, type: 'delete' | 'copy' | 'move') {
    const btn = doc.createElement('button')

    Object.assign(btn.style, {
        all: 'unset',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: '4px',
        background: '#1f1f1f',
    })

    btn.dataset.action = type

    const svgNS = 'http://www.w3.org/2000/svg'
    const svg = doc.createElementNS(svgNS, 'svg')
    svg.setAttribute('width', '14')
    svg.setAttribute('height', '14')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('fill', 'none')
    svg.setAttribute('stroke', 'white')
    svg.setAttribute('stroke-width', '2')
    svg.setAttribute('stroke-linecap', 'round')
    svg.setAttribute('stroke-linejoin', 'round')

    if (type === 'delete') {
        svg.innerHTML = `<polyline points="3 6 5 6 21 6"/>
                         <path d="M19 6l-1 14H6L5 6"/>
                         <path d="M10 11v6"/>
                         <path d="M14 11v6"/>`
    }

    if (type === 'copy') {
        svg.innerHTML = `<rect x="9" y="9" width="13" height="13" rx="2"/>
                         <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`
    }

    if (type === 'move') {
        svg.innerHTML = `<polyline points="5 9 2 12 5 15"/>
                         <polyline points="9 5 12 2 15 5"/>
                         <polyline points="15 19 12 22 9 19"/>
                         <polyline points="19 9 22 12 19 15"/>`
    }

    svg.style.pointerEvents = 'none'
    btn.appendChild(svg)

    return btn
}
