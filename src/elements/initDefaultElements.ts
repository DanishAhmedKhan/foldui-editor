import { ButtonElement } from './buttonElement'
import { SectionElement } from './sectionElement'
import { TextElement } from './textElement'
import { useElementRegistry } from './useElementRegistry'

export function registerDefaultElements() {
    const { registerElement } = useElementRegistry.getState()

    registerElement(TextElement)
    registerElement(ButtonElement)
    registerElement(SectionElement)
}
