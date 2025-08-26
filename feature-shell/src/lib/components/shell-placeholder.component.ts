import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fever-shell-placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <h2>Coming soon</h2>
      <p>This route is wired and awaiting implementation.</p>
    </section>
  `,
})
export class ShellPlaceholderComponent {}
