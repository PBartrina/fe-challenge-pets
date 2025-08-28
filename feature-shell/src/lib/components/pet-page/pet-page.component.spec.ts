import { routes } from 'feature-shell';
import { Route } from '@angular/router';

describe('feature-shell routes', () => {
  it('defines a root route with children', () => {
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);

    const root = routes[0];
    expect(root.children).toBeDefined();
    expect(Array.isArray(root.children)).toBe(true);
  });

  it('contains "", "pets", "pets/:id", and "favorites" child routes', () => {
    const children = routes[0].children ?? [];
    const paths = children.map((r: Route) => r.path);

    expect(paths).toContain('');
    expect(paths).toContain('pets');
    expect(paths).toContain('pets/:id');
    expect(paths).toContain('favorites');
  });

  it('configures lazy load components for child routes', () => {
    const children = routes[0].children ?? [];

    const home = children.find((r: Route) => r.path === '');
    const pets = children.find((r: Route) => r.path === 'pets');
    const petDetail = children.find(
      (r: Route) => r.path === 'pets/:id'
    );
    const favorites = children.find(
      (r: Route) => r.path === 'favorites'
    );

    expect(typeof home?.loadComponent).toBe('function');
    expect(typeof pets?.loadComponent).toBe('function');
    expect(typeof petDetail?.loadComponent).toBe('function');
    expect(typeof favorites?.loadComponent).toBe('function');
  });
});