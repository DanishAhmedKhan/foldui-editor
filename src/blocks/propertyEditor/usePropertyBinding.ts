import { useActiveBreakpoint } from '../responsive/useActiveBreakpoint'
import { buildPropertyPath } from './propertyResolver'
import { PropertyField } from './PropertyTypes'

export function usePropertyBinding(
    node: any,
    field: PropertyField,
    patchPath: (nodeId: string, path: string, value: any) => void,
) {
    const breakpoint = useActiveBreakpoint()

    const path = buildPropertyPath(field, breakpoint)

    function getByPath(obj: any, path: string) {
        return path.split('.').reduce((acc, key) => {
            if (!acc) return undefined
            return acc[key]
        }, obj)
    }

    const value = getByPath(node, path)

    const setValue = (newValue: any) => {
        patchPath(node.id, path, newValue)
    }

    return {
        value,
        setValue,
        path,
        breakpoint,
    }
}
