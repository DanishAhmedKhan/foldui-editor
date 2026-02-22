import { GenericNodeSpec, SchemaBuilder } from 'foldui-builder'

export interface EditorElementContext {
    selectedNodeId: string
    builder: SchemaBuilder<GenericNodeSpec>
}

export interface EditorElement {
    type: string
    name: string
    description?: string
    icon?: React.ReactNode
    create: (context: EditorElementContext) => string
}
