import { ChangeDetectionStrategy, Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'fever-shell-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
    template: `
    <main>
      <h1>Fever Pets</h1>
      <nav aria-label="Primary">
        <a routerLink="/pets">Pets</a> |
        <a routerLink="/favorites">Favorites</a>
      </nav>
    </main>
  `,
})
export class ShellHomeComponent {}
