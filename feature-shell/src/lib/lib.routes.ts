import {Route, Routes} from '@angular/router';
import { FeatureShell } from './feature-shell/feature-shell';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'pets',
            },
            {
                path: 'pets',
                loadComponent: () =>
                    import('./components/pet-page/pet-page.component').then(
                        (c) => c.PetsPageComponent
                    ),
            },
            {
                path: 'favorites',
                loadComponent: () =>
                    import('./components/shell-placeholder.component').then(
                        (c) => c.ShellPlaceholderComponent
                    ),
            },
        ],
    },
];

