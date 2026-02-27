import { GenericNodeSpec, SchemaBuilder } from 'foldui-builder'

export interface EditorElementContext {
    parentNodeId: string
    builder: SchemaBuilder<GenericNodeSpec>
    index?: number
}

export interface EditorElement {
    type: string
    name: string
    description?: string
    icon?: React.ReactNode
    create: (context: EditorElementContext) => string
}
