import React from 'react'
import { PropertyField } from './PropertyTypes'
import { useEditorStore } from '../../store/useEditorStore'

type FieldRendererProps = {
    field: PropertyField
    nodeId: string
    path: string
}

function getByPath(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => {
        if (!acc) return undefined
        return acc[key]
    }, obj)
}

export const FieldRenderer: React.FC<FieldRendererProps> = React.memo(({ field, nodeId, path }) => {
    const value = useEditorStore((s) => {
        const node = s.builder.getNode(nodeId)
        if (!node) return undefined
        return getByPath(node, path)
    })

    const patchPath = useEditorStore((s) => s.patchPath)

    const onChange = (val: any) => {
        patchPath(nodeId, path, val)
    }

    switch (field.type) {
        case 'text':
            return <input value={value || ''} onChange={(e) => onChange(e.target.value)} />

        case 'number':
            return <input type="number" value={value || 0} onChange={(e) => onChange(Number(e.target.value))} />

        case 'slider': {
            const numericValue = parseInt(value) || 0

            return (
                <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    value={numericValue}
                    onChange={(e) => onChange(e.target.value + 'px')}
                />
            )
        }

        case 'select':
            return (
                <select value={value} onChange={(e) => onChange(e.target.value)}>
                    {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            )

        case 'color':
            return <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} />

        default:
            return null
    }
})
