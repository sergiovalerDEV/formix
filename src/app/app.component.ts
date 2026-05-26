import { Component, inject } from '@angular/core';
import { BuilderComponent } from './features/builder/builder.component';
import { PreviewComponent } from './features/preview/preview-component';
import { ExportComponent } from './features/export/export.component';
import { BuilderStore } from '../state/builder.store';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BuilderComponent, PreviewComponent, ExportComponent],
  template: `
    <div class="app">
      <header class="app__header">
        <div class="app__brand">
          <span class="app__logo">⬡</span>
          <span class="app__name">Formix</span>
        </div>
        <input
          class="app__title-input"
          [value]="store.title()"
          (input)="store.setTitle($any($event.target).value)"
          placeholder="Form title..."
        />
        <div class="app__actions">
          <span class="app__field-count">
            {{ store.fields().length }} field{{ store.fields().length !== 1 ? 's' : '' }}
          </span>
          <button class="app__btn-clear" (click)="store.clearAll()">Clear</button>
          <app-export />
        </div>
      </header>

      <main class="app__workspace">
        <app-builder class="app__panel app__panel--builder" />
        <div class="app__divider"></div>
        <app-preview class="app__panel app__panel--preview" />
      </main>
    </div>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly store = inject(BuilderStore);
}