import { Component, inject } from '@angular/core'
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'
import { BuilderStore } from '../../../../state/builder.store'
import type { FormField } from '../../../../core/models/field.model'

@Component({
  selector: 'app-form-renderer',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="renderer">

      @if (store.fields().length === 0) {
        <div class="renderer__empty">
          <p class="text--muted text--sm">Add fields to see the preview</p>
        </div>
      } @else {
        <form class="renderer__form" [formGroup]="form" (ngSubmit)="onSubmit()">

          @for (field of visibleFields(); track field.id) {
            <div class="renderer__field animate-fade-in">

              <label class="renderer__label" [for]="field.id">
                {{ field.label }}
                @if (field.validation.required) {
                  <span class="renderer__required">*</span>
                }
              </label>

              @switch (field.type) {
                @case ('text') {
                  <input
                    class="renderer__input"
                    [id]="field.id"
                    [formControlName]="field.id"
                    [placeholder]="field.placeholder ?? ''"
                    type="text"
                  />
                }
                @case ('textarea') {
                  <textarea
                    class="renderer__input renderer__input--textarea"
                    [id]="field.id"
                    [formControlName]="field.id"
                    [placeholder]="field.placeholder ?? ''"
                    rows="3"
                  ></textarea>
                }
                @case ('number') {
                  <input
                    class="renderer__input"
                    [id]="field.id"
                    [formControlName]="field.id"
                    [placeholder]="field.placeholder ?? '0'"
                    type="number"
                  />
                }
                @case ('email') {
                  <input
                    class="renderer__input"
                    [id]="field.id"
                    [formControlName]="field.id"
                    [placeholder]="field.placeholder ?? 'you@example.com'"
                    type="email"
                  />
                }
                @case ('select') {
                  <select
                    class="renderer__input renderer__input--select"
                    [id]="field.id"
                    [formControlName]="field.id"
                  >
                    <option value="" disabled selected>Select an option</option>
                    @for (opt of field.options; track opt.value) {
                      <option [value]="opt.value">{{ opt.label }}</option>
                    }
                  </select>
                }
                @case ('checkbox') {
                  <div class="renderer__checkbox-wrap">
                    <input
                      class="renderer__checkbox"
                      [id]="field.id"
                      [formControlName]="field.id"
                      type="checkbox"
                    />
                    <span class="text--sm">{{ field.label }}</span>
                  </div>
                }
                @case ('date') {
                  <input
                    class="renderer__input"
                    [id]="field.id"
                    [formControlName]="field.id"
                    type="date"
                  />
                }
                @case ('conditional') {
                  <input
                    class="renderer__input"
                    [id]="field.id"
                    [formControlName]="field.id"
                    [placeholder]="field.placeholder ?? ''"
                    type="text"
                  />
                }
              }

              @if (field.helpText) {
                <p class="renderer__help text--xs text--muted">{{ field.helpText }}</p>
              }

              @if (form.get(field.id)?.invalid && form.get(field.id)?.touched) {
                <p class="renderer__error text--xs">This field has errors</p>
              }

            </div>
          }

          <button type="submit" class="renderer__submit">
            Submit form
          </button>

        </form>
      }

    </div>
  `,
  styleUrl: './form-renderer.component.scss',
})
export class FormRendererComponent {
  readonly store = inject(BuilderStore)
  form = new FormGroup({})

  ngDoCheck(): void {
    this.rebuildForm()
  }

  private rebuildForm(): void {
    const fields = this.store.fields()
    const existingKeys = Object.keys(this.form.controls)
    const newKeys = fields.map(f => f.id)

    const toAdd = newKeys.filter(k => !existingKeys.includes(k))
    const toRemove = existingKeys.filter(k => !newKeys.includes(k))

    toRemove.forEach(k => this.form.removeControl(k))
    toAdd.forEach(k => {
      const field = fields.find(f => f.id === k)!
      const validators = field.validation.required ? [Validators.required] : []
      this.form.addControl(k, new FormControl('', validators))
    })
  }

  visibleFields(): FormField[] {
    const fields = this.store.fields()
    const values = this.form.value as Record<string, string>

    return fields.filter(field => {
      if (field.type !== 'conditional' || !field.conditional) return true
      const { dependsOn, showWhen } = field.conditional
      return values[dependsOn] === showWhen
    })
  }

  onSubmit(): void {
    this.form.markAllAsTouched()
    if (this.form.valid) {
      console.log('Form value:', this.form.value)
      alert('Form submitted! Check the console.')
    }
  }
}