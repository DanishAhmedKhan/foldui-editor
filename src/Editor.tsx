import React, { useEffect, useState } from 'react'
import { useEditorStore } from './store/useEditorStore'
import { Canvas } from './blocks/canvas/Canvas'
import { ElementLibrary } from './blocks/elementLibrary/ElementLibrary'
import { registerDefaultElements } from './elements/initDefaultElements'
import { Responsive } from './blocks/responsive/Responsive'
import { PropertyEditor } from './blocks/propertyEditor/PropertyEditor'

export interface FolduiEditorProps {
    schema?: unknown
}

export const Editor: React.FC<FolduiEditorProps> = () => {
    const builder = useEditorStore((s) => s.builder)
    const selectNode = useEditorStore((s) => s.setSelectedNodeId)

    const [mode, setMode] = useState<'library' | 'properties'>('properties')

    useEffect(() => {
        const rootId = builder.getRootId()
        selectNode(rootId)
    }, [builder, selectNode])

    useEffect(() => {
        registerDefaultElements()
    }, [])

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ddd',
                background: '#fafafa',
                boxSizing: 'border-box',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    height: 70,
                    borderBottom: '1px solid black',
                    flexShrink: 0,
                }}
            >
                <Responsive />
            </div>

            <div style={{ display: 'flex', flex: 1 }}>
                <div
                    style={{
                        flex: '0 0 300px',
                        borderRight: '1px solid black',
                        overflowY: 'auto',
                    }}
                >
                    <div style={{ padding: 10 }}>
                        <button onClick={() => setMode('library')}>＋</button>
                        <button onClick={() => setMode('properties')}>⚙</button>
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
        </div>
    )
}
