import React, { useEffect } from 'react'
import { useEditorStore } from './store/useEditorStore'
import { Canvas } from './blocks/canvas/Canvas'
import { ElementLibrary } from './blocks/elementLibrary/ElementLibrary'
import { registerDefaultElements } from './elements/initDefaultElements'

export interface FolduiEditorProps {
    schema?: unknown
}

export const Editor: React.FC<FolduiEditorProps> = ({ schema }) => {
    const builder = useEditorStore((s) => s.builder)
    const selectNode = useEditorStore((s) => s.selectNode)
    const version = useEditorStore((s) => s.version)

    useEffect(() => {
        const rootId = builder.getRootId()
        selectNode(rootId)
    }, [])

    useEffect(() => {
        registerDefaultElements()
    }, [])

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                border: '1px solid #ddd',
                background: '#fafafa',
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '70px',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    borderBottom: '1px solid black',
                }}
            ></div>

            <div
                style={{
                    width: '300px',
                    height: 'calc(100% - 70px)',
                    position: 'absolute',
                    top: '70px',
                    left: '0',
                    borderRight: '1px solid black',
                }}
            >
                <ElementLibrary />
            </div>

            <div
                style={{
                    width: 'calc(100% - 300px)',
                    height: 'calc(100% - 70px)',
                    position: 'absolute',
                    top: '70px',
                    left: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        width: 'calc(100% - 100px)',
                        height: 'calc(100% - 100px)',
                        border: '1px solid black',
                    }}
                >
                    <Canvas />
                </div>
            </div>
        </div>
    )
}
