import {Route, Routes} from '@angular/router';
import { FeatureShell } from './feature-shell/feature-shell';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./components/shell-home.component').then((c) => c.ShellHomeComponent),
            },
            {
                path: 'pets',
                loadComponent: () =>
                    import('./components/pet-page/pet-page.component').then((c) => c.PetsPageComponent),
            },
            {
                path: 'pets/:id',
                loadComponent: () =>
                    import('./components/pet-detail/pet-detail.component').then(
                        (c) => c.PetDetailComponent
                    ),
            },
        ],
    },
];

