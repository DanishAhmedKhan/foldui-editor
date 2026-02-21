import { SchemaBuilder } from 'foldui-builder'

export interface EditorElementContext {
    selectedNodeId: string | null
    builder: SchemaBuilder
}

export interface EditorElement {
    type: string
    name: string
    description?: string
    icon?: React.ReactNode
    create: (context: EditorElementContext) => any
}
