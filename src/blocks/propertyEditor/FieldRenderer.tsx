import { PropertyField } from './PropertyTypes'

type FieldRendererProps = {
    field: PropertyField
    value: any
    onChange: (value: any) => void
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange }) => {
    switch (field.type) {
        case 'text':
            return <input value={value || ''} onChange={(e) => onChange(e.target.value)} />

        case 'number':
            return <input type="number" value={value || 0} onChange={(e) => onChange(Number(e.target.value))} />

        case 'slider':
            return (
                <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    value={parseInt(value) || 0}
                    onChange={(e) => onChange(e.target.value + 'px')}
                />
            )

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
            return <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />

        default:
            return null
    }
}
