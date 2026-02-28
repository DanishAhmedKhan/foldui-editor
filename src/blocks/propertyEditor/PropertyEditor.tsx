import { getElementDefinition } from '../../elements/getElementDefinition'
import { useEditorStore } from '../../store/useEditorStore'
import { FieldRenderer } from './FieldRenderer'

export const PropertyEditor = () => {
    const selectedNodeId = useEditorStore((s) => s.selectedNodeId)
    const builder = useEditorStore((s) => s.builder)
    const patchPath = useEditorStore((s) => s.patchPath)
    const version = useEditorStore((s) => s.version)

    if (!selectedNodeId) return null

    const node = builder.getNode(selectedNodeId)
    if (!node) return null

    const element = getElementDefinition(node.type)
    if (!element?.properties) return null

    function getValue(obj: any, path: string) {
        return path.split('.').reduce((o, key) => o?.[key], obj)
    }

    return (
        <div style={{ padding: 16 }}>
            {element.properties.map((group) => (
                <div key={group.id} style={{ marginBottom: 20 }}>
                    <h4>{group.label}</h4>

                    {group.fields.map((field) => {
                        const value = getValue(node, field.path)

                        return (
                            <FieldRenderer
                                key={field.id}
                                field={field}
                                value={value}
                                onChange={(val) => patchPath(selectedNodeId, field.path, val)}
                            />
                        )
                    })}
                </div>
            ))}
        </div>
    )
}
