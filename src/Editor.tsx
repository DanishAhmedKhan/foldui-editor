import React, { useEffect } from 'react'
import { useEditorStore } from './store/useEditorStore'
import { Canvas } from './blocks/canvas/Canvas'
import { ElementLibrary } from './blocks/elementLibrary/ElementLibrary'
import { registerDefaultElements } from './elements/initDefaultElements'

export interface FolduiEditorProps {
    schema?: unknown
}

export const Editor: React.FC<FolduiEditorProps> = ({ schema }) => {
    // const setRenderSchema = useEditorStore((s) => s.setRenderSchema)

    // // Push schema into builder store whenever it changes
    // useEffect(() => {
    //     if (!schema) return
    //     setRenderSchema(schema)
    // }, [schema, setRenderSchema])

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
                    border: '1px solid black',
                }}
            ></div>

            <div
                style={{
                    width: '300px',
                    height: 'calc(100% - 70px)',
                    position: 'absolute',
                    top: '70px',
                    left: '0',
                    border: '1px solid black',
                }}
            >
                <ElementLibrary />
            </div>
        </div>
    )
}
