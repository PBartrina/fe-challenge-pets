import { ChangeDetectionStrategy, Component, input, computed, signal } from '@angular/core';
import type { Pet } from 'data-access-pets';

const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,
<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'>
  <rect width='100%' height='100%' fill='%23f2f2f2'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='14' font-family='Arial, sans-serif'>
    Image unavailable
  </text>
</svg>`;

@Component({
    selector: 'ui-pet-card',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <article
                class="pet-card"
                role="article"
                [attr.aria-labelledby]="'pet-' + pet().id + '-name'">
            <header>
                <h3 id="pet-{{ pet().id }}-name">{{ pet().name }}</h3>
        <p class="pet-meta">
          <span class="kind">{{ pet().kind }}</span>
          @if (pet().number_of_lives !== undefined) {
            <span class="lives"> · lives: {{ pet().number_of_lives }}</span>
          }
        </p>
      </header>

      <figure class="media" [attr.aria-labelledby]="'Photo of {{ pet().name }}'">
        <img
          [src]="imgSrc()"
          (error)="onImgError()"
          alt="{{ pet().name }} the {{ pet().kind }}"
          loading="lazy"
        />
      </figure>

      @if (pet().description) {
        <p class="description">{{ pet().description }}</p>
      }

      <dl class="metrics">
        <div>
          <dt>Weight</dt>
          <dd>{{ pet().weight }}</dd>
        </div>
        <div>
          <dt>Height</dt>
          <dd>{{ pet().height }}</dd>
        </div>
        <div>
          <dt>Length</dt>
          <dd>{{ pet().length }}</dd>
        </div>
      </dl>
    </article>
  `,
  styles: [`
    :host {
      display: block;
      border-radius: 8px;
      outline: 1px solid transparent;
      transition: transform 140ms ease, outline-color 140ms ease, box-shadow 140ms ease;
    }

    :host(:hover) {
      transform: scale(1.02);
      outline-color: #888;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
      cursor: pointer;
    }

    .pet-card {
      border: 1px solid #e3e3e3;
      border-radius: 8px;
      padding: 12px;
      background: #fff;
      overflow: hidden;
    }

    .pet-meta { color: #555; margin: 0 0 8px 0; }
    .kind { font-weight: 600; text-transform: capitalize; }
    .lives { color: #666; }
    .description { margin: 8px 0; color: #333; }

    .media {
      margin: 0 0 8px 0;
      border-radius: 6px;
      overflow: hidden;
      aspect-ratio: 16 / 9;
      background: #f2f2f2;
      display: block;
    }
    .media img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin: 8px 0 0 0;
    }
    .metrics dt { font-weight: 600; color: #444; }
    .metrics dd { margin: 0; color: #222; }
  `],
})
export class PetCardComponent {
  pet = input.required<Pet>();

  private readonly hadError = signal(false);

  readonly imgSrc = computed(() => {
    const url = this.pet().photo_url;
    return !url || this.hadError() ? PLACEHOLDER_SVG : url;
  });

  onImgError(): void {
    this.hadError.set(true);
  }
}

