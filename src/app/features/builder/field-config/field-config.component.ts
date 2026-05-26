import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BuilderStore } from '../../../../state/builder.store'
import type { FormField, FieldValidation, SelectOption } from '../../../../core/models/field.model'

@Component({
  selector: 'app-field-config',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="config">

      @if (!store.selectedField()) {
        <div class="config__empty">
          <p class="text--muted text--sm">Select a field to configure it</p>
        </div>
      } @else {
        <div class="config__panel animate-fade-in">

          <p class="config__section-label text--upper text--muted">Field settings</p>

          <!-- Label -->
          <div class="config__group">
            <label class="config__label">Label</label>
            <input
              class="config__input"
              [ngModel]="field.label"
              (ngModelChange)="patch({ label: $event })"
              placeholder="Field label"
            />
          </div>

          <!-- Placeholder -->
          @if (field.type !== 'checkbox' && field.type !== 'date') {
            <div class="config__group">
              <label class="config__label">Placeholder</label>
              <input
                class="config__input"
                [ngModel]="field.placeholder"
                (ngModelChange)="patch({ placeholder: $event })"
                placeholder="Hint text..."
              />
            </div>
          }

          <!-- Help text -->
          <div class="config__group">
            <label class="config__label">Help text</label>
            <input
              class="config__input"
              [ngModel]="field.helpText"
              (ngModelChange)="patch({ helpText: $event })"
              placeholder="Additional info..."
            />
          </div>

          <div class="config__divider"></div>
          <p class="config__section-label text--upper text--muted">Validation</p>

          <!-- Required -->
          <div class="config__group config__group--row">
            <label class="config__label">Required</label>
            <button
              class="config__toggle"
              [class.config__toggle--on]="field.validation.required"
              (click)="patchValidation({ required: !field.validation.required })"
            >
              {{ field.validation.required ? 'Yes' : 'No' }}
            </button>
          </div>

          <!-- Min/Max length para text -->
          @if (field.type === 'text' || field.type === 'textarea' || field.type === 'email') {
            <div class="config__row">
              <div class="config__group">
                <label class="config__label">Min length</label>
                <input
                  class="config__input"
                  type="number"
                  [ngModel]="field.validation.minLength"
                  (ngModelChange)="patchValidation({ minLength: +$event })"
                  placeholder="0"
                />
              </div>
              <div class="config__group">
                <label class="config__label">Max length</label>
                <input
                  class="config__input"
                  type="number"
                  [ngModel]="field.validation.maxLength"
                  (ngModelChange)="patchValidation({ maxLength: +$event })"
                  placeholder="∞"
                />
              </div>
            </div>
          }

          <!-- Min/Max para number -->
          @if (field.type === 'number') {
            <div class="config__row">
              <div class="config__group">
                <label class="config__label">Min</label>
                <input
                  class="config__input"
                  type="number"
                  [ngModel]="field.validation.min"
                  (ngModelChange)="patchValidation({ min: +$event })"
                  placeholder="−∞"
                />
              </div>
              <div class="config__group">
                <label class="config__label">Max</label>
                <input
                  class="config__input"
                  type="number"
                  [ngModel]="field.validation.max"
                  (ngModelChange)="patchValidation({ max: +$event })"
                  placeholder="+∞"
                />
              </div>
            </div>
          }

          <!-- Opciones para select -->
          @if (field.type === 'select') {
            <div class="config__group">
              <label class="config__label">Options</label>
              @for (opt of field.options; track opt.value; let i = $index) {
                <div class="config__option-row">
                  <input
                    class="config__input"
                    [ngModel]="opt.label"
                    (ngModelChange)="updateOption(i, 'label', $event)"
                    placeholder="Label"
                  />
                  <input
                    class="config__input config__input--sm"
                    [ngModel]="opt.value"
                    (ngModelChange)="updateOption(i, 'value', $event)"
                    placeholder="value"
                  />
                  <button class="config__remove-opt" (click)="removeOption(i)">✕</button>
                </div>
              }
              <button class="config__add-opt" (click)="addOption()">+ Add option</button>
            </div>
          }

          <!-- Regla condicional -->
          @if (field.type === 'conditional') {
            <div class="config__group">
              <label class="config__label">Show when field ID equals</label>
              <input
                class="config__input"
                [ngModel]="field.conditional?.dependsOn"
                (ngModelChange)="patchConditional('dependsOn', $event)"
                placeholder="other-field-id"
              />
              <input
                class="config__input"
                style="margin-top: var(--space-2)"
                [ngModel]="field.conditional?.showWhen"
                (ngModelChange)="patchConditional('showWhen', $event)"
                placeholder="trigger value"
              />
            </div>
          }

        </div>
      }

    </div>
  `,
  styleUrl: './field-config.component.scss',
})
export class FieldConfigComponent {
  readonly store = inject(BuilderStore)

  get field(): FormField {
    return this.store.selectedField()!
  }

  patch(partial: Partial<FormField>): void {
    this.store.updateField(this.field.id, partial)
  }

  patchValidation(partial: Partial<FieldValidation>): void {
    this.patch({ validation: { ...this.field.validation, ...partial } })
  }

  patchConditional(key: 'dependsOn' | 'showWhen', value: string): void {
    this.patch({
      conditional: {
        dependsOn: key === 'dependsOn' ? value : (this.field.conditional?.dependsOn ?? ''),
        showWhen:   key === 'showWhen'  ? value : (this.field.conditional?.showWhen  ?? ''),
      },
    })
  }

  addOption(): void {
    const opts = [...(this.field.options ?? []), { label: 'New option', value: `opt-${Date.now()}` }]
    this.patch({ options: opts })
  }

  removeOption(index: number): void {
    const opts = (this.field.options ?? []).filter((_, i) => i !== index)
    this.patch({ options: opts })
  }

  updateOption(index: number, key: keyof SelectOption, value: string): void {
    const opts = (this.field.options ?? []).map((o, i) =>
      i === index ? { ...o, [key]: value } : o
    )
    this.patch({ options: opts })
  }
}