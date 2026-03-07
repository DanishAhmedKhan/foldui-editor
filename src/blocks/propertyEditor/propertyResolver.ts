export interface PropertyField {
    id: string
    path?: string
    responsive?: boolean
    styleKey?: string
}

export function buildPropertyPath(field: PropertyField, breakpoint: string) {
    if (field.responsive) {
        if (!field.styleKey) {
            throw new Error(`Responsive field "${field.id}" requires styleKey`)
        }

        return `responsive.${field.styleKey}.${breakpoint}.${field.id}`
    }

    if (!field.path) {
        throw new Error(`Non-responsive field "${field.id}" requires path`)
    }

    return field.path
}
