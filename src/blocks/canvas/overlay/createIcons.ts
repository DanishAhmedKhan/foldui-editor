export interface IconOptions {
    customSvg?: string
    background?: string
    color?: string
}

export function createIcon(doc: Document, type: 'delete' | 'copy' | 'move', options?: IconOptions) {
    const btn = doc.createElement('button')

    const bg = options?.background ?? 'transparent'
    const color = options?.color ?? 'white'

    Object.assign(btn.style, {
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: 'none',
        padding: '0',
        borderRadius: '4px',
        background: bg,
    })

    btn.dataset.action = type

    const svgNS = 'http://www.w3.org/2000/svg'

    let svg: SVGSVGElement

    if (options?.customSvg) {
        const wrapper = doc.createElement('div')
        wrapper.innerHTML = options.customSvg.trim()

        svg = wrapper.firstElementChild as SVGSVGElement

        if (svg) {
            svg.setAttribute('width', '14')
            svg.setAttribute('height', '14')

            const color = options?.color ?? 'white'

            svg.removeAttribute('fill')
            svg.removeAttribute('stroke')

            svg.querySelectorAll('*').forEach((el) => {
                const hasStroke = el.hasAttribute('stroke')
                const hasFill = el.hasAttribute('fill')

                if (hasStroke) {
                    el.setAttribute('stroke', color)
                }

                if (hasFill) {
                    el.setAttribute('fill', color)
                }

                // If neither defined → assume fill-based icon
                if (!hasStroke && !hasFill) {
                    el.setAttribute('fill', color)
                }
            })
        }
    } else {
        svg = doc.createElementNS(svgNS, 'svg')
        svg.setAttribute('width', '14')
        svg.setAttribute('height', '14')
        svg.setAttribute('viewBox', '0 0 24 24')
        svg.setAttribute('fill', 'none')
        svg.setAttribute('stroke', color)
        svg.setAttribute('stroke-width', '2')
        svg.setAttribute('stroke-linecap', 'round')
        svg.setAttribute('stroke-linejoin', 'round')

        if (type === 'delete') {
            svg.innerHTML = `
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6"/>
                <path d="M14 11v6"/>
            `
        }

        if (type === 'copy') {
            svg.innerHTML = `
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            `
        }

        if (type === 'move') {
            svg.innerHTML = `
                <polyline points="5 9 2 12 5 15"/>
                <polyline points="9 5 12 2 15 5"/>
                <polyline points="15 19 12 22 9 19"/>
                <polyline points="19 9 22 12 19 15"/>
            `
        }
    }

    svg.style.pointerEvents = 'none'
    btn.appendChild(svg)

    return btn
}
