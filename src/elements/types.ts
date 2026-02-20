export interface EditorElementContext {
    selectedNodeId: string | null
    rootSchema: any
}

export interface EditorElement {
    type: string
    name: string
    description?: string
    icon?: React.ReactNode
    create: (context: EditorElementContext) => any
}
