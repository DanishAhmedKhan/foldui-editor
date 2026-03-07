import { getElementDefinition } from '../../elements/getElementDefinition'
import { useEditorStore } from '../../store/useEditorStore'
import { useActiveBreakpoint } from '../responsive/useActiveBreakpoint'
import { FieldRenderer } from './FieldRenderer'
import { buildPropertyPath } from './propertyResolver'

export const PropertyEditor = () => {
    const selectedNodeId = useEditorStore((s) => s.selectedNodeId)
    const builder = useEditorStore((s) => s.builder)

    const breakpoint = useActiveBreakpoint()

    if (!selectedNodeId) return null

    const node = builder.getNode(selectedNodeId)
    if (!node) return null

    const element = getElementDefinition(node.editorType ?? node.type)
    if (!element?.properties) return null

    return (
        <div style={{ padding: 16 }}>
            {element.properties.map((group) => (
                <div key={group.id} style={{ marginBottom: 20 }}>
                    <h4>{group.label}</h4>

                    {group.fields.map((field) => {
                        const path = buildPropertyPath(field, breakpoint)

                        return <FieldRenderer key={field.id} field={field} nodeId={selectedNodeId} path={path} />
                    })}
                </div>
            ))}
        </div>
    )
}
