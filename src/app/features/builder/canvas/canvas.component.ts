import { Component, inject } from '@angular/core'
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop'
import { BuilderStore } from '../../../../state/builder.store'
import type { FormField } from '../../../../core/models/field.model'

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CdkDropList, CdkDrag],
  template: `
    <div class="canvas">

      @if (store.fields().length === 0) {
        <div class="canvas__empty">
          <span class="canvas__empty-icon">⬡</span>
          <p class="canvas__empty-title">No fields yet</p>
          <p class="canvas__empty-sub text--muted text--sm">
            Add fields from the palette on the left
          </p>
        </div>
      } @else {
        <ul
          class="canvas__list"
          cdkDropList
          (cdkDropListDropped)="onDrop($event)"
        >
          @for (field of store.fields(); track field.id) {
            <li
              class="canvas__field"
              [class.canvas__field--selected]="store.selected() === field.id"
              cdkDrag
              (click)="store.selectField(field.id)"
            >
              <span class="canvas__drag-handle" cdkDragHandle>⠿</span>

              <span class="canvas__field-type text--mono text--xs text--muted">
                {{ field.type }}
              </span>

              <span class="canvas__field-label">
                {{ field.label }}
                @if (field.validation.required) {
                  <span class="canvas__required">*</span>
                }
              </span>

              <button
                class="canvas__remove"
                (click)="$event.stopPropagation(); store.removeField(field.id)"
                aria-label="Remove field"
              >
                ✕
              </button>

              <div *cdkDragPlaceholder class="canvas__placeholder"></div>
            </li>
          }
        </ul>
      }

    </div>
  `,
  styleUrl: './canvas.component.scss',
})
export class CanvasComponent {
  readonly store = inject(BuilderStore)

  onDrop(event: CdkDragDrop<FormField[]>): void {
    this.store.reorderFields(event.previousIndex, event.currentIndex)
  }
}