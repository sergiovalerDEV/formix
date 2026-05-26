import { v4 as uuid } from 'uuid'
import type { FormField, FieldType } from './models/field.model'

const DEFAULTS: Record<FieldType, Partial<FormField>> = {
  text:        { label: 'Text field',     placeholder: 'Enter text...' },
  textarea:    { label: 'Long text',      placeholder: 'Enter description...' },
  number:      { label: 'Number',         placeholder: '0' },
  email:       { label: 'Email',          placeholder: 'you@example.com' },
  select:      { label: 'Select',         options: [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
  ]},
  checkbox:    { label: 'Checkbox' },
  date:        { label: 'Date' },
  conditional: { label: 'Conditional field', placeholder: 'Shown when...' },
}

export function createField(type: FieldType, order: number): FormField {
  return {
    id: uuid(),
    type,
    order,
    validation: {},
    ...DEFAULTS[type],
  } as FormField
}