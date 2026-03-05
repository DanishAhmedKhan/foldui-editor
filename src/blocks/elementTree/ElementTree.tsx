import React from 'react'
import { useEditorStore } from '../../store/useEditorStore'

export const ElementTree: React.FC = () => {
    const builder = useEditorStore((s) => s.builder)
    const selectedNodeId = useEditorStore((s) => s.selectedNodeId)
    const setSelectedNodeId = useEditorStore((s) => s.setSelectedNodeId)

    const rootId = builder.getRootId()
    if (!rootId) return null

    const renderNode = (nodeId: string, depth = 0) => {
        const node = builder.getNode(nodeId)
        if (!node) return null

        const children = builder.getChildren(nodeId) ?? []

        return (
            <div key={nodeId}>
                <div
                    onClick={() => setSelectedNodeId(nodeId)}
                    style={{
                        padding: '6px 8px',
                        paddingLeft: 8 + depth * 16,
                        cursor: 'pointer',
                        background: selectedNodeId === nodeId ? '#e6f0ff' : 'transparent',
                        borderRadius: 4,
                    }}
                >
                    {node.type}
                </div>

                {children.map((childId) => renderNode(childId, depth + 1))}
            </div>
        )
    }

    return (
        <div
            style={{
                padding: 16,
                borderRight: '1px solid #ddd',
                height: '100%',
                overflowY: 'auto',
            }}
        >
            <h3>Tree</h3>
            {renderNode(rootId)}
        </div>
    )
}
