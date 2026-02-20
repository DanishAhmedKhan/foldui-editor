import { create } from 'zustand'
import { EditorElement } from '../elements/types'

interface ElementRegistryState {
    elements: EditorElement[]
    registerElement: (element: EditorElement) => void
}

export const useElementRegistry = create<ElementRegistryState>((set) => ({
    elements: [],

    registerElement: (element) =>
        set((state) => ({
            elements: [...state.elements, element],
        })),
}))
