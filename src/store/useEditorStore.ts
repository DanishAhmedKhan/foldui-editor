import { create } from 'zustand'
import { NodeInput, SchemaBuilder } from 'foldui-builder'
import { FoldNode, NodeSpec } from 'foldui'
import { EditorElement } from '../elements/types'

type NodeSpecType = typeof NodeSpec

type Device = 'responsive' | 'desktop' | 'tablet' | 'mobile'

type EditorState = {
    builder: SchemaBuilder<NodeSpecType>
    version: number
    selectedNodeId: string | null

    selectNode: (id: string | null) => void

    addNode: (options: NodeInput, parentId: string) => string
    removeNode: (id: string) => void

    updateField: (id: string, field: string, value: unknown) => void
    patchField: (id: string, field: string, patch: Record<string, unknown>) => void
    patchPath: (id: string, path: string | (string | number)[], value: unknown) => void

    getRenderSchema: () => FoldNode

    addElement: (element: EditorElement) => void

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
}

export const useEditorStore = create<EditorState>((set, get) => {
    const builder = new SchemaBuilder<NodeSpecType>(NodeSpec)

    return {
        builder,
        version: 0,
        selectedNodeId: null,

        selectNode: (id) => set({ selectedNodeId: id }),

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

        getRenderSchema: () => {
            return builder.toRenderSchema()
        },

        addElement: (element) => {
            const { selectedNodeId, builder } = get()
            if (!selectedNodeId) return

            element.create({
                selectedNodeId,
                builder,
            })

            set((state) => ({
                version: state.version + 1,
                // selectedNodeId: newId ?? state.selectedNodeId,
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
    }
})
