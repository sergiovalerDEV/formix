import { Component, inject } from '@angular/core'
import { BuilderStore } from '../../../state/builder.store'
import { JsonPrettyPipe } from '../../shared/pipes/json-pretty.pipe'

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [JsonPrettyPipe],
  template: `
    <div class="export">

      <button class="export__trigger" (click)="open = !open">
        Export schema
      </button>

      @if (open) {
        <div class="export__backdrop" (click)="open = false"></div>

        <div class="export__modal animate-fade-in">

          <div class="export__modal-header">
            <h3 class="export__modal-title">JSON Schema</h3>
            <button class="export__close" (click)="open = false">✕</button>
          </div>

          <pre class="export__code text--mono text--sm">{{ store.schema() | jsonPretty }}</pre>

          <div class="export__modal-footer">
            <button class="export__btn" (click)="copyToClipboard()">
              {{ copied ? '✓ Copied!' : 'Copy to clipboard' }}
            </button>
            <button class="export__btn export__btn--secondary" (click)="download()">
              Download .json
            </button>
          </div>

        </div>
      }

    </div>
  `,
  styleUrl: './export.component.scss',
})
export class ExportComponent {
  readonly store = inject(BuilderStore)
  open = false
  copied = false

  copyToClipboard(): void {
    const text = JSON.stringify(this.store.schema(), null, 2)
    navigator.clipboard.writeText(text).then(() => {
      this.copied = true
      setTimeout(() => (this.copied = false), 2000)
    })
  }

  download(): void {
    const content = JSON.stringify(this.store.schema(), null, 2)
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${this.store.title().toLowerCase().replace(/\s+/g, '-')}-schema.json`
    a.click()
    URL.revokeObjectURL(url)
  }
}