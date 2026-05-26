import { Component, output } from '@angular/core'
import type { FieldType } from '../../../../core/models/field.model'

interface PaletteItem {
  type: FieldType
  label: string
  icon: string
  description: string
}

@Component({
  selector: 'app-field-palette',
  standalone: true,
  template: `
    <div class="palette">

      <p class="palette__label text--upper text--muted">Field types</p>

      <ul class="palette__list">
        @for (item of items; track item.type) {
          <li class="palette__item" (click)="add.emit(item.type)">
            <span class="palette__icon">{{ item.icon }}</span>
            <span class="palette__info">
              <span class="palette__name">{{ item.label }}</span>
              <span class="palette__desc text--muted text--xs">{{ item.description }}</span>
            </span>
            <span class="palette__plus">+</span>
          </li>
        }
      </ul>

    </div>
  `,
  styleUrl: './field-palette.component.scss',
})
export class FieldPaletteComponent {
  readonly add = output<FieldType>()

  readonly items: PaletteItem[] = [
    { type: 'text',        icon: 'T',  label: 'Text',        description: 'Single line input' },
    { type: 'textarea',    icon: '¶',  label: 'Long text',   description: 'Multi-line input' },
    { type: 'number',      icon: '#',  label: 'Number',      description: 'Numeric input' },
    { type: 'email',       icon: '@',  label: 'Email',       description: 'Validated email' },
    { type: 'select',      icon: '▾',  label: 'Select',      description: 'Dropdown options' },
    { type: 'checkbox',    icon: '✓',  label: 'Checkbox',    description: 'Boolean toggle' },
    { type: 'date',        icon: '▦',  label: 'Date',        description: 'Date picker' },
    { type: 'conditional', icon: '⋔',  label: 'Conditional', description: 'Shows when...' },
  ]
}