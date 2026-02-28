import { GenericNodeSpec, SchemaBuilder } from 'foldui-builder'
import { PropertyGroup } from '../blocks/propertyEditor/PropertyTypes'

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
    properties?: PropertyGroup[]
}
