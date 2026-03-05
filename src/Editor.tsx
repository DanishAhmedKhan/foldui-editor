import React, { useState, useRef } from 'react'
import { Canvas } from './blocks/canvas/Canvas'
import { ElementLibrary } from './blocks/elementLibrary/ElementLibrary'
import { Responsive } from './blocks/responsive/Responsive'
import { PropertyEditor } from './blocks/propertyEditor/PropertyEditor'
import { ElementTree } from './blocks/elementTree/ElementTree'
import { useEditorEvent } from './events/useEditorEvent'
import { useEditorInitialization } from './core/useEditorInitizlization'

export interface FolduiEditorProps {
    schema?: unknown
}

export const Editor: React.FC<FolduiEditorProps> = () => {
    useEditorInitialization()

    const [mode, setMode] = useState<'library' | 'properties'>('library')
    const [showTree, setShowTree] = useState(false)

    const [treePosition, setTreePosition] = useState({ x: 200, y: 120 })
    const dragRef = useRef<{ offsetX: number; offsetY: number } | null>(null)

    useEditorEvent('ElementSelected', ({ elementId }) => {
        if (elementId) {
            setMode('properties')
        } else {
            setMode('library')
        }
    })

    const startDrag = (e: React.MouseEvent) => {
        dragRef.current = {
            offsetX: e.clientX - treePosition.x,
            offsetY: e.clientY - treePosition.y,
        }

        document.addEventListener('mousemove', onDrag)
        document.addEventListener('mouseup', stopDrag)
    }

    const onDrag = (e: MouseEvent) => {
        if (!dragRef.current) return

        setTreePosition({
            x: e.clientX - dragRef.current.offsetX,
            y: e.clientY - dragRef.current.offsetY,
        })
    }

    const stopDrag = () => {
        dragRef.current = null
        document.removeEventListener('mousemove', onDrag)
        document.removeEventListener('mouseup', stopDrag)
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ddd',
                background: '#fafafa',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {/* Top Bar */}
            <div
                style={{
                    height: 70,
                    borderBottom: '1px solid black',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 16px',
                }}
            >
                <Responsive />

                <button onClick={() => setShowTree(true)}>Open Tree</button>
            </div>

            {/* Main Layout */}
            <div style={{ display: 'flex', flex: 1 }}>
                <div
                    style={{
                        flex: '0 0 300px',
                        borderRight: '1px solid black',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div style={{ padding: 10 }}>
                        <button onClick={() => setMode('library')}>＋</button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {mode === 'library' ? <ElementLibrary /> : <PropertyEditor />}
                    </div>
                </div>

                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Canvas />
                </div>
            </div>

            {/* Floating Draggable Tree */}
            {showTree && (
                <div
                    style={{
                        position: 'absolute',
                        top: treePosition.y,
                        left: treePosition.x,
                        width: 300,
                        height: 400,
                        background: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: 8,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 9999,
                    }}
                >
                    {/* Header (Draggable Area) */}
                    <div
                        onMouseDown={startDrag}
                        style={{
                            padding: '10px 12px',
                            cursor: 'move',
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontWeight: 600,
                            background: '#f5f5f5',
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        }}
                    >
                        <span>Element Tree</span>

                        <button
                            onClick={() => setShowTree(false)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: 16,
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Tree Content */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        <ElementTree />
                    </div>
                </div>
            )}
        </div>
    )
}
