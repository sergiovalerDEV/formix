import { Component, inject } from '@angular/core'
import { BuilderStore } from '../../../state/builder.store'
import { FormRendererComponent } from './form-renderer/form-renderer.component'
import { JsonPrettyPipe } from '../../shared/pipes/json-pretty.pipe'

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [FormRendererComponent, JsonPrettyPipe],
  template: `
    <div class="preview">

      <div class="preview__tabs">
        <button
          class="preview__tab"
          [class.preview__tab--active]="activeTab === 'form'"
          (click)="activeTab = 'form'"
        >
          Live preview
        </button>
        <button
          class="preview__tab"
          [class.preview__tab--active]="activeTab === 'schema'"
          (click)="activeTab = 'schema'"
        >
          JSON Schema
        </button>
      </div>

      <div class="preview__content">
        @if (activeTab === 'form') {
          <app-form-renderer />
        } @else {
          <pre class="preview__schema text--mono text--sm">{{ store.schema() | jsonPretty }}</pre>
        }
      </div>

    </div>
  `,
  styleUrl: './preview.component.scss',
})
export class PreviewComponent {
  readonly store = inject(BuilderStore)
  activeTab: 'form' | 'schema' = 'form'
}