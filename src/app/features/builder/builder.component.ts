import { Component, inject } from '@angular/core'
import { BuilderStore } from '../../../state/builder.store'
import { FieldPaletteComponent } from './field-palette/field-palette.component'
import { CanvasComponent } from './canvas/canvas.component'
import { FieldConfigComponent } from './field-config/field-config.component'
import type { FieldType } from '../../../core/models/field.model'

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [FieldPaletteComponent, CanvasComponent, FieldConfigComponent],
  template: `
    <div class="builder">

      <aside class="builder__palette">
        <app-field-palette (add)="store.addField($event)" />
      </aside>

      <div class="builder__main">

        <div class="builder__canvas-wrap">
          <p class="builder__section-label text--upper text--muted">Canvas</p>
          <app-canvas />
        </div>

        <div class="builder__config-wrap">
          <p class="builder__section-label text--upper text--muted">Configure</p>
          <app-field-config />
        </div>

      </div>

    </div>
  `,
  styleUrl: './builder.component.scss',
})
export class BuilderComponent {
  readonly store = inject(BuilderStore)
}