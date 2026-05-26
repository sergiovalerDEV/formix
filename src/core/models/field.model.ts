export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'select'
  | 'checkbox'
  | 'date'
  | 'conditional'

export interface SelectOption {
  label: string
  value: string
}

export interface FieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
}

export interface ConditionalRule {
  dependsOn: string       
  showWhen: string        
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  helpText?: string
  validation: FieldValidation
  options?: SelectOption[]       
  conditional?: ConditionalRule   
  order: number
}