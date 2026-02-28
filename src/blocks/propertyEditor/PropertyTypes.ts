export type PropertyGroup = {
    id: string
    label: string
    fields: PropertyField[]
}

export type PropertyField = TextField | SelectField | NumberField | SliderField | ColorField

type BaseField = {
    id: string
    label: string
    path: string // where to write in node (e.g. "style.text.fontSize")
}

export interface TextField extends BaseField {
    type: 'text'
}

export interface NumberField extends BaseField {
    type: 'number'
}

export interface SelectField extends BaseField {
    type: 'select'
    options: { label: string; value: string }[]
}

export interface SliderField extends BaseField {
    type: 'slider'
    min: number
    max: number
}

export interface ColorField extends BaseField {
    type: 'color'
}
