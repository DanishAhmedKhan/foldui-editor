import React from 'react'
import { useEditorStore } from '../../store/useEditorStore'

export const Responsive: React.FC = () => {
    const device = useEditorStore((s) => s.device)
    const setDevice = useEditorStore((s) => s.setDevice)

    const Button = ({ label, value }: any) => (
        <button
            onClick={() => setDevice(value)}
            style={{
                padding: '10px 20px',
                cursor: 'pointer',
                fontWeight: device === value ? 'bold' : 'normal',
            }}
        >
            {label}
        </button>
    )

    return (
        <div style={{ display: 'flex', gap: 8 }}>
            <Button label="Responsive" value="responsive" />
            <Button label="Desktop" value="desktop" />
            <Button label="Tablet" value="tablet" />
            <Button label="Mobile" value="mobile" />
        </div>
    )
}
