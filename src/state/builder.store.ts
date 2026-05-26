import { Injectable, signal, computed } from '@angular/core'
import type { FormField, FieldType } from '../core/models/field.model'
import { createField } from '../core/field-factory'
import { generateSchema } from '../core/schema-generator'

@Injectable({ providedIn: 'root' })
export class BuilderStore {
  readonly fields   = signal<FormField[]>([])
  readonly selected = signal<string | null>(null)
  readonly title    = signal<string>('My Form')

  readonly schema = computed(() =>
    generateSchema(this.fields(), this.title())
  )

  readonly selectedField = computed(() =>
    this.fields().find(f => f.id === this.selected()) ?? null
  )

  addField(type: FieldType): void {
    const order = this.fields().length
    const field = createField(type, order)
    this.fields.update(fields => [...fields, field])
    this.selected.set(field.id)
  }

  removeField(id: string): void {
    this.fields.update(fields => fields.filter(f => f.id !== id))
    if (this.selected() === id) this.selected.set(null)
  }

  updateField(id: string, patch: Partial<FormField>): void {
    this.fields.update(fields =>
      fields.map(f => f.id === id ? { ...f, ...patch } : f)
    )
  }

  reorderFields(from: number, to: number): void {
    this.fields.update(fields => {
      const copy = [...fields]
      const [moved] = copy.splice(from, 1)
      copy.splice(to, 0, moved)
      return copy.map((f, i) => ({ ...f, order: i }))
    })
  }

  selectField(id: string | null): void {
    this.selected.set(id)
  }

  setTitle(title: string): void {
    this.title.set(title)
  }

  clearAll(): void {
    this.fields.set([])
    this.selected.set(null)
  }
}