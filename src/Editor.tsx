import React, { useState } from 'react'
import { Canvas } from './blocks/canvas/Canvas'
import { ElementLibrary } from './blocks/elementLibrary/ElementLibrary'
import { Responsive } from './blocks/responsive/Responsive'
import { PropertyEditor } from './blocks/propertyEditor/PropertyEditor'
import { useEditorEvent } from './events/useEditorEvent'
import { useEditorInitialization } from './core/useEditorInitizlization'

export interface FolduiEditorProps {
    schema?: unknown
}

export const Editor: React.FC<FolduiEditorProps> = () => {
    useEditorInitialization()

    const [mode, setMode] = useState<'library' | 'properties'>('library')

    useEditorEvent('ElementSelected', ({ elementId }) => {
        if (elementId) {
            setMode('properties')
        } else {
            setMode('library')
        }
    })

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
        </div>
    )
}
