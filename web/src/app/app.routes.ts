import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'pets',
    },
    {
        path: '',
        loadChildren: () =>
            import('feature-shell').then((m) => m.routes),
    },
];
