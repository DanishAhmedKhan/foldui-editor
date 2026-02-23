import React from 'react'
import { useEditorStore } from '../../store/useEditorStore'
import { ResizeHandle } from './ResizeHandle'

interface Props {
    children: React.ReactNode
}

export const CanvasFrame: React.FC<Props> = ({ children }) => {
    const device = useEditorStore((s) => s.device)
    const customWidths = useEditorStore((s) => s.customWidths)
    const isResizing = useEditorStore((s) => s.isResizing)

    const isFixed = device !== 'responsive'

    const width = device === 'responsive' ? '100%' : customWidths[device]

    return (
        <div
            id="canvas-frame"
            style={{
                position: 'relative',
                width,
                height: '100%',
                background: '#f5f5f5',
                transition: isResizing ? 'none' : 'width 0.2s ease',
            }}
        >
            {children}

            {isFixed && <ResizeHandle />}
        </div>
    )
}
