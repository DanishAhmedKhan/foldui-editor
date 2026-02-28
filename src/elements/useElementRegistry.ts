import { create } from 'zustand'
import { EditorElement } from '../elements/types'

interface ElementRegistryState {
    elements: EditorElement[]
    registerElement: (element: EditorElement) => void
}

export const useElementRegistry = create<ElementRegistryState>((set) => ({
    elements: [],

    registerElement: (element) =>
        set((state) => {
            const exists = state.elements.find((el) => el.type === element.type)
            if (exists) return state

            return {
                elements: [...state.elements, element],
            }
        }),
}))
