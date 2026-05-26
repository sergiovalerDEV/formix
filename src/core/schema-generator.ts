import type { FormField } from './models/field.model'
import type { JsonSchema, JsonSchemaProperty } from './models/schema.model'

const TYPE_MAP: Record<string, string> = {
  text:        'string',
  textarea:    'string',
  email:       'string',
  number:      'number',
  checkbox:    'boolean',
  date:        'string',
  select:      'string',
  conditional: 'string',
}

const FORMAT_MAP: Record<string, string> = {
  email: 'email',
  date:  'date',
}

export function generateSchema(fields: FormField[], title = 'My Form'): JsonSchema {
  const properties: Record<string, JsonSchemaProperty> = {}
  const required: string[] = []

  for (const field of [...fields].sort((a, b) => a.order - b.order)) {
    const prop: JsonSchemaProperty = {
      type:  TYPE_MAP[field.type] ?? 'string',
      title: field.label,
    }

    if (field.placeholder)        prop['x-ui-placeholder'] = field.placeholder
    if (field.helpText)           prop['x-ui-help']        = field.helpText
    if (FORMAT_MAP[field.type])   prop.format              = FORMAT_MAP[field.type]
    if (field.validation.minLength !== undefined) prop.minLength = field.validation.minLength
    if (field.validation.maxLength !== undefined) prop.maxLength = field.validation.maxLength
    if (field.validation.min      !== undefined) prop.minimum   = field.validation.min
    if (field.validation.max      !== undefined) prop.maximum   = field.validation.max
    if (field.validation.pattern)                prop.pattern   = field.validation.pattern
    if (field.options?.length)    prop.enum = field.options.map(o => o.value)
    if (field.conditional)        prop['x-ui-conditional'] = field.conditional
    if (field.type !== 'conditional') prop['x-ui-type'] = field.type

    properties[field.id] = prop

    if (field.validation.required) {
      required.push(field.id)
    }
  }

  return {
    $schema:    'https://json-schema.org/draft/2020-12/schema',
    type:       'object',
    title,
    required,
    properties,
  }
}