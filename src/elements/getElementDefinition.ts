import { useElementRegistry } from './useElementRegistry'

export function getElementDefinition(type: string) {
    const { elements } = useElementRegistry.getState()
    console.log(elements)
    return elements.find((el) => el.type === type)
}
