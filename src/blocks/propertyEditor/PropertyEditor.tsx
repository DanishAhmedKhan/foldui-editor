import { resolveNode } from '../../core/resolveNode'
import { getElementDefinition } from '../../elements/getElementDefinition'
import { useEditorStore } from '../../store/useEditorStore'
import { useActiveBreakpoint } from '../responsive/useActiveBreakpoint'
import { FieldRenderer } from './FieldRenderer'
import { buildPropertyPath } from './propertyResolver'

export const PropertyEditor = () => {
    const selectedNodeId = useEditorStore((s) => s.selectedNodeId)
    const builder = useEditorStore((s) => s.builder)
    const patchPath = useEditorStore((s) => s.patchPath)

    const breakpoint = useActiveBreakpoint()

    if (!selectedNodeId) return null

    const node = builder.getNode(selectedNodeId)
    if (!node) return null

    const element = getElementDefinition(node.editorType ?? node.type)
    if (!element?.properties) return null

    // const resolvedNode = resolveNode(node, element)

    function getByPath(obj: any, path: string) {
        return path.split('.').reduce((acc, key) => {
            if (!acc) return undefined
            return acc[key]
        }, obj)
    }

    return (
        <div style={{ padding: 16 }}>
            {element.properties.map((group) => (
                <div key={group.id} style={{ marginBottom: 20 }}>
                    <h4>{group.label}</h4>

                    {group.fields.map((field) => {
                        const path = buildPropertyPath(field, breakpoint)
                        console.log(path)

                        const value = getByPath(node, path)
                        console.log('value', value)

                        return (
                            <FieldRenderer
                                key={field.id}
                                field={field}
                                value={value ?? field.min ?? 0}
                                onChange={(val) => {
                                    console.log(path)
                                    patchPath(selectedNodeId, path, val)
                                }}
                            />
                        )
                    })}
                </div>
            ))}
        </div>
    )
}
