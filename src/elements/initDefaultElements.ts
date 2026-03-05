import { ButtonElement } from './buttonElement'
import { HeadingElement } from './headingElement'
import { SectionElement } from './sectionElement'
import { TextElement } from './textElement'
import { useElementRegistry } from './useElementRegistry'

export function registerDefaultElements() {
    const { registerElement } = useElementRegistry.getState()

    registerElement(SectionElement)
    registerElement(HeadingElement)
    registerElement(TextElement)
    registerElement(ButtonElement)
}
