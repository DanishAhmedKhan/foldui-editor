import React, { useRef, useState, useEffect } from 'react'
import { useEditorStore } from '../../store/useEditorStore'

export const ResizeHandle: React.FC = () => {
    const device = useEditorStore((s) => s.device)
    const customWidths = useEditorStore((s) => s.customWidths)
    const setCustomWidth = useEditorStore((s) => s.setCustomWidth)

    const [dragging, setDragging] = useState(false)

    const startX = useRef(0)
    const startWidth = useRef(0)

    const onMouseDown = (e: React.MouseEvent) => {
        if (device === 'responsive') return

        startX.current = e.clientX
        startWidth.current = customWidths[device]

        setDragging(true)
    }

    useEffect(() => {
        if (!dragging) return

        const onMouseMove = (e: MouseEvent) => {
            if (device === 'responsive') return

            const delta = e.clientX - startX.current
            const newWidth = startWidth.current + delta

            const clamped = Math.max(280, Math.min(newWidth, 2000))

            setCustomWidth(device, clamped)
        }

        const onMouseUp = () => {
            setDragging(false)
        }

        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [dragging, device, setCustomWidth])

    return (
        <div
            onMouseDown={onMouseDown}
            style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: 6,
                height: '100%',
                cursor: 'ew-resize',
                background: 'blue',
            }}
        />
    )
}
