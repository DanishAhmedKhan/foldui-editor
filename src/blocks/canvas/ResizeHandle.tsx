import React, { useRef, useEffect } from 'react'
import { useEditorStore } from '../../store/useEditorStore'

export const ResizeHandle: React.FC = () => {
    const device = useEditorStore((s) => s.device)
    const setCustomWidth = useEditorStore((s) => s.setCustomWidth)
    const setIsResizing = useEditorStore((s) => s.setIsResizing)

    const frameRef = useRef<HTMLDivElement | null>(null)
    const handleRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        frameRef.current = document.getElementById('canvas-frame') as HTMLDivElement
    }, [])

    const MIN_WIDTH = 320
    const MAX_WIDTH = 2000

    const onPointerDown = (e: React.PointerEvent) => {
        if (device === 'responsive' || !frameRef.current) return

        const handle = handleRef.current
        if (!handle) return

        handle.setPointerCapture(e.pointerId)

        setIsResizing(true)
        document.body.style.userSelect = 'none'
        document.body.style.cursor = 'ew-resize'
    }

    const onPointerMove = (e: React.PointerEvent) => {
        if (!frameRef.current || !e.currentTarget.hasPointerCapture(e.pointerId)) return

        const rect = frameRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2

        const rawWidth = (e.clientX - centerX) * 2

        if (rawWidth <= MIN_WIDTH) {
            frameRef.current.style.width = `${MIN_WIDTH}px`
            return
        }

        const newWidth = Math.min(rawWidth, MAX_WIDTH)

        frameRef.current.style.width = `${newWidth}px`
    }

    const onPointerUp = (e: React.PointerEvent) => {
        if (!frameRef.current) return

        const handle = handleRef.current
        if (handle && handle.hasPointerCapture(e.pointerId)) {
            handle.releasePointerCapture(e.pointerId)
        }

        document.body.style.userSelect = ''
        document.body.style.cursor = ''

        const finalWidth = frameRef.current.offsetWidth
        if (device !== 'responsive') {
            setCustomWidth(device, finalWidth)
        }
        setIsResizing(false)
    }

    return (
        <div
            ref={handleRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: 6,
                height: '100%',
                background: 'blue',
                cursor: 'ew-resize',
                zIndex: 10,
                touchAction: 'none',
            }}
        />
    )
}
