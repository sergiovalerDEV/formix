export interface JsonSchemaProperty {
  type: string | string[]
  title?: string
  description?: string
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  pattern?: string
  enum?: string[]
  format?: string
  'x-ui-placeholder'?: string
  'x-ui-help'?: string
  'x-ui-type'?: string
  'x-ui-conditional'?: {
    dependsOn: string
    showWhen: string
  }
}

export interface JsonSchema {
  $schema: string
  type: 'object'
  title?: string
  required: string[]
  properties: Record<string, JsonSchemaProperty>
}