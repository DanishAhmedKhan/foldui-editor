import { create } from 'zustand'
import { SchemaBuilder } from 'foldui-builder'
import { NodeSpec } from 'foldui'
import { EditorElement } from '../elements/types'

type NodeSpecType = typeof NodeSpec

type AddNodeOptions = {
    type: string
    props?: Record<string, unknown>
    style?: Record<string, unknown>
    responsive?: Record<string, unknown>
}

type EditorState = {
    builder: SchemaBuilder<NodeSpecType>
    version: number
    selectedNodeId: string | null

    selectNode: (id: string | null) => void

    addNode: (options: AddNodeOptions, parentId: string) => string
    removeNode: (id: string) => void

    updateField: (id: string, field: string, value: unknown) => void
    patchField: (id: string, field: string, patch: Record<string, unknown>) => void
    patchPath: (id: string, path: string | (string | number)[], value: unknown) => void

    getRenderSchema: () => unknown

    addElement: (element: EditorElement) => void
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
            const { selectedNodeId } = get()

            const fragment = element.create({
                selectedNodeId,
                rootSchema: builder.toRenderSchema(),
            })

            if (selectedNodeId) {
                builder.add(fragment).into(selectedNodeId)
            }

            set((state) => ({
                version: state.version + 1,
            }))
        },
    }
})
