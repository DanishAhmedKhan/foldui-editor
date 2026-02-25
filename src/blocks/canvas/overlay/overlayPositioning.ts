export type OverlayPlacement =
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center'
    | 'left-center'
    | 'right-center'

export interface PositionOptions {
    placement: OverlayPlacement
    offset?: number
    outside?: boolean
}

export function computePosition(rect: DOMRect, placement: OverlayPlacement, offset = 6, outside = true) {
    let top = 0
    let left = 0

    const o = outside ? offset : -offset

    switch (placement) {
        case 'top-left':
            top = rect.top - o
            left = rect.left
            break
        case 'top-right':
            top = rect.top - o
            left = rect.right
            break
        case 'bottom-left':
            top = rect.bottom + o
            left = rect.left
            break
        case 'bottom-right':
            top = rect.bottom + o
            left = rect.right
            break
        case 'top-center':
            top = rect.top - o
            left = rect.left + rect.width / 2
            break
        case 'bottom-center':
            top = rect.bottom + o
            left = rect.left + rect.width / 2
            break
        case 'left-center':
            top = rect.top + rect.height / 2
            left = rect.left - o
            break
        case 'right-center':
            top = rect.top + rect.height / 2
            left = rect.right + o
            break
    }

    return { top, left }
}
