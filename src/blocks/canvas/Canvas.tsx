import React, { useRef } from 'react'
import { CanvasFrame } from './CanvasFrame'
import { useCanvasRenderer } from './useCanvasRenderer'
import { useCanvasOverlay } from './useCanvasOverlay'
import { useCanvasEmptyState } from './useCanvasEmptyState'

export const Canvas: React.FC = () => {
    const iframeRef = useRef<HTMLIFrameElement | null>(null)

    useCanvasRenderer(iframeRef)
    useCanvasOverlay({ iframeRef })
    useCanvasEmptyState({ iframeRef })

    return (
        <CanvasFrame>
            <iframe
                ref={iframeRef}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: 'white',
                }}
                sandbox="allow-scripts allow-same-origin"
            />
        </CanvasFrame>
    )
}
