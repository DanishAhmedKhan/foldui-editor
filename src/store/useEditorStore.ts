import { create } from 'zustand'
import { NodeInput, SchemaBuilder } from 'foldui-builder'
import { FoldNode, NodeSpec } from 'foldui'
import { EditorElement } from '../elements/types'
import { editorEvents } from '../events/editorEvents'

type NodeSpecType = typeof NodeSpec

type Device = 'responsive' | 'desktop' | 'tablet' | 'mobile'
type EditorMode = 'edit' | 'preview'

type DragState = {
    elementType: string
    elementDefinition: unknown
}

function getValue(obj: any, path: string) {
    return path.split('.').reduce((o, key) => o?.[key], obj)
}

function setValue(obj: any, path: string, value: any) {
    const keys = path.split('.')
    const last = keys.pop()!

    const target = keys.reduce((o, key) => {
        if (!o[key]) o[key] = {}
        return o[key]
    }, obj)

    target[last] = value
}

type EditorState = {
    builder: SchemaBuilder<NodeSpecType>
    version: number

    selectedNodeId: string | null
    setSelectedNodeId: (id: string | null) => void

    addNode: (options: NodeInput, parentId: string) => string
    removeNode: (id: string) => void

    updateField: (id: string, field: string, value: unknown) => void
    patchField: (id: string, field: string, patch: Record<string, unknown>) => void
    patchPath: (id: string, path: string | (string | number)[], value: unknown) => void

    updateNode: (id: string, path: string, value: unknown) => void

    getRenderSchema: () => FoldNode

    addElement: (element: EditorElement, parentId?: string, index?: number) => void

    device: Device
    customWidths: {
        desktop: number
        tablet: number
        mobile: number
    }

    setDevice: (device: Device) => void
    setCustomWidth: (device: Exclude<Device, 'responsive'>, width: number) => void

    isResizing: boolean
    setIsResizing: (value: boolean) => void

    mode: EditorMode

    draggingElement: DragState | null
    startDragging: (el: any) => void
    stopDragging: () => void
}

export const useEditorStore = create<EditorState>((set, get) => {
    const builder = new SchemaBuilder<NodeSpecType>(NodeSpec)

    return {
        builder,
        version: 0,
        selectedNodeId: null,

        setSelectedNodeId: (id) => {
            set({ selectedNodeId: id })

            editorEvents.emit('element:selected', { nodeId: id })
        },

        addNode: (options, parentId) => {
            const id = builder.add(options).into(parentId)

            set((state) => ({
                version: state.version + 1,
            }))

            return id
        },

        removeNode: (id) => {
            builder.remove(id)

            set((state) => ({
                version: state.version + 1,
            }))
        },

        updateField: (id, field, value) => {
            builder.updateField(id, field, value)

            set((state) => ({
                version: state.version + 1,
            }))
        },

        patchField: (id, field, patch) => {
            builder.patchField(id, field, patch)

            set((state) => ({
                version: state.version + 1,
            }))
        },

        patchPath: (id, path, value) => {
            builder.patchPath(id, path, value)

            set((state) => ({
                version: state.version + 1,
            }))
        },

        updateNode: (id, path, value) => {
            const node = builder.getNode(id)
            if (!node) return

            setValue(node, path, value)

            set((state) => ({
                version: state.version + 1,
            }))
        },

        getRenderSchema: () => {
            return builder.toRenderSchema()
        },

        addElement: (element: EditorElement, parentNodeId?: string, index?: number) => {
            const { selectedNodeId, builder } = get()

            const targetParentId = parentNodeId ?? selectedNodeId
            if (!targetParentId) return

            element.create({
                parentNodeId: targetParentId,
                builder,
                index,
            })

            set((state) => ({
                version: state.version + 1,
            }))
        },

        device: 'responsive',

        customWidths: {
            desktop: 1200,
            tablet: 768,
            mobile: 375,
        },

        setDevice: (device) => set({ device }),

        setCustomWidth: (device, width) =>
            set((state) => ({
                customWidths: {
                    ...state.customWidths,
                    [device]: width,
                },
            })),

        isResizing: false,
        setIsResizing: (value: boolean) => set({ isResizing: value }),

        mode: 'edit',

        draggingElement: null,

        startDragging: (element) =>
            set({
                draggingElement: {
                    elementType: element.type,
                    elementDefinition: element,
                },
            }),

        stopDragging: () => set({ draggingElement: null }),
    }
})
