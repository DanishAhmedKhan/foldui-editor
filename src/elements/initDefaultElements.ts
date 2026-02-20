import { TextElement } from './textElement'
import { useElementRegistry } from './useElementRegistry'

export function registerDefaultElements() {
    const { registerElement } = useElementRegistry.getState()

    registerElement(TextElement)
}
