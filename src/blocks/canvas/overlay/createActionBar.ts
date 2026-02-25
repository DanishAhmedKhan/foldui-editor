import { createIcon } from './createIcons'
import { computePosition, PositionOptions } from './overlayPositioning'

export interface ActionConfig {
    type: 'delete' | 'copy' | 'move'
}

export interface ActionBarOptions {
    background?: string
    iconColor?: string
    iconBackground?: string
    customIcons?: Partial<Record<'delete' | 'copy' | 'move', string>>
}

export function createActionBar(
    doc: Document,
    rect: DOMRect,
    actions: ActionConfig[],
    position: PositionOptions,
    direction: 'horizontal' | 'vertical',
    onAction: (type: string) => void,
    options?: ActionBarOptions,
) {
    const container = doc.createElement('div')

    Object.assign(container.style, {
        position: 'absolute',
        display: 'flex',
        gap: '4px',
        padding: '4px',
        background: options?.background ?? '#111',
        // borderRadius: '6px',
        pointerEvents: 'auto',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        zIndex: '1000000',
    })

    const pos = computePosition(rect, position.placement, position.offset, position.outside)

    container.style.top = pos.top + 'px'
    container.style.left = pos.left + 'px'

    actions.forEach((a) => {
        const btn = createIcon(doc, a.type, {
            customSvg: options?.customIcons?.[a.type],
            background: options?.iconBackground,
            color: options?.iconColor,
        })

        btn.addEventListener('click', (e) => {
            e.stopPropagation()
            onAction(a.type)
        })

        container.appendChild(btn)
    })

    return container
}
