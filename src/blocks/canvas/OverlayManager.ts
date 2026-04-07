import { createOverlayEngine } from './createOverlayEngine'
import { createActionBar } from './overlay/createActionBar'

export class OverlayManager {
    private engine
    private doc: Document
    private selectedId: string | null = null
    private hoveredId: string | null = null
    private actionBar: HTMLElement | null = null

    constructor(doc: Document) {
        this.doc = doc
        this.engine = createOverlayEngine(doc)
    }

    setHover(id: string | null) {
        if (this.hoveredId === id) return
        this.hoveredId = id
        this.render()
    }

    setSelected(id: string | null) {
        if (this.selectedId === id) return
        this.selectedId = id
        this.render()
    }

    private render() {
        this.engine.clear()

        if (this.hoveredId && this.hoveredId !== this.selectedId) {
            this.engine.show(this.hoveredId)
        }

        if (this.selectedId) {
            this.engine.show(this.selectedId)
            this.renderActionBar()
        } else {
            this.destroyActionBar()
        }
    }

    private renderActionBar() {
        if (!this.selectedId) return

        const el = this.doc.querySelector(`[data-fui-id="${this.selectedId}"]`) as HTMLElement | null

        if (!el) return

        const rect = el.getBoundingClientRect()

        this.destroyActionBar()

        this.actionBar = createActionBar(this.doc, rect, [{ type: 'copy' }, { type: 'move' }, { type: 'delete' }], {
            placement: 'top-left',
        })

        if (!this.actionBar) return

        Object.assign(this.actionBar.style, {
            pointerEvents: 'auto',
            position: 'absolute',
            zIndex: '9999999',
        })

        this.doc.body.appendChild(this.actionBar)
    }

    private destroyActionBar() {
        this.actionBar?.remove()
        this.actionBar = null
    }

    destroy() {
        this.engine.clear()
        this.destroyActionBar()
    }
}
