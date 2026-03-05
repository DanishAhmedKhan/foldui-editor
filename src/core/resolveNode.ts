export function deepMerge(target: any = {}, source: any = {}) {
    const output = { ...target }

    Object.keys(source).forEach((key) => {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
            output[key] = deepMerge(target[key], source[key])
        } else {
            output[key] = source[key]
        }
    })

    return output
}

export function resolveNode(node: any, elementDef: any) {
    return {
        ...node,
        style: deepMerge(elementDef?.defaultStyle || {}, node.style || {}),
    }
}
