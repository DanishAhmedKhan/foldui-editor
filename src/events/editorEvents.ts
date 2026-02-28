export interface EditorEventMap {
    ElementSelected: {
        elementId: string
        elementType?: string
    }

    ElementAdded: {
        elementId: string
        parentId: string
    }

    ElementRemoved: {
        elementId: string
        parentId: string
    }

    ElementUpdated: {
        elementId: string
        changedProps: Record<string, any>
    }

    BreakpointChanged: {
        breakpoint: 'desktop' | 'tablet' | 'mobile'
    }

    HistoryChanged: {
        canUndo: boolean
        canRedo: boolean
    }
}
