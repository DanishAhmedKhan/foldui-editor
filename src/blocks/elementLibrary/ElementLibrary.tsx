import React from 'react'
import { useElementRegistry } from '../../elements/useElementRegistry'
import { useEditorStore } from '../../store/useEditorStore'

export const ElementLibrary: React.FC = () => {
    const elements = useElementRegistry((s) => s.elements)
    const addElement = useEditorStore((s) => s.addElement)

    return (
        <div
            style={{
                padding: 16,
                borderRight: '1px solid #ddd',
                height: '100%',
                overflowY: 'auto',
            }}
        >
            <h3>Elements</h3>

            {elements.length === 0 && <div style={{ fontSize: 12, opacity: 0.6 }}>No elements registered</div>}

            {elements.map((element) => (
                <div
                    key={element.type}
                    style={{
                        padding: 10,
                        marginBottom: 10,
                        border: '1px solid #eee',
                        borderRadius: 6,
                        cursor: 'pointer',
                        background: '#fff',
                    }}
                    onClick={() => addElement(element)}
                >
                    {element.icon && <div style={{ marginBottom: 6 }}>{element.icon}</div>}

                    <div style={{ fontWeight: 600 }}>{element.name}</div>

                    {element.description && (
                        <div
                            style={{
                                fontSize: 12,
                                opacity: 0.7,
                                marginTop: 4,
                            }}
                        >
                            {element.description}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
