import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Pet, PetsService } from 'data-access-pets';
import { PetCardComponent } from 'ui';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map, shareReplay, switchMap } from 'rxjs';
import { take } from 'rxjs/operators';

type SortKey = 'weight' | 'length' | 'height' | 'name' | 'kind';
type SortOrder = 'asc' | 'desc';

@Component({
  selector: 'feature-pet-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'pet-page.component.html',
  styleUrl: 'pet-page.component.scss',
  imports: [PetCardComponent, RouterLink]
})
export class PetsPageComponent {
  private readonly router = inject(Router);
  private readonly api = inject(PetsService);
  private readonly route = inject(ActivatedRoute);

  // Sorting state
  readonly sortBy = signal<SortKey>('name');
  readonly sortOrder = signal<SortOrder>('asc');

  // Kind filter used when sortBy === 'kind'
  readonly kindFilter = signal<'' | 'dog' | 'cat'>('');

  // Pagination state
  readonly page = signal(1);       // 1-based for JSON Server
  readonly limit = signal(12);     // items per page

  // On init: hydrate state from query params (if present)
  constructor() {
    const qp = this.route.snapshot.queryParamMap;
    const sort = qp.get('sort') as SortKey | null;
    const order = qp.get('order') as SortOrder | null;
    const kind = (qp.get('kind') as 'dog' | 'cat' | null) ?? '';
    const page = Number(qp.get('page'));
    const limit = Number(qp.get('limit'));
    if (sort) this.sortBy.set(sort);
    if (order) this.sortOrder.set(order);
    if (kind) this.kindFilter.set(kind);
    if (!Number.isNaN(page) && page > 0) this.page.set(page);
    if (!Number.isNaN(limit) && limit > 0) this.limit.set(limit);
  }

  // Persist state to URL query params (without growing history)
  readonly queryParams = computed(() => {
    const sort = this.sortBy();
    const order = this.sortOrder();
    const page = this.page();
    const limit = this.limit();
    const kind = this.kindFilter();

    // Only include 'order' when not filtering by kind
    return {
      sort,
      order: sort === 'kind' ? undefined : order,
      page,
      limit,
      kind: sort === 'kind' && kind ? kind : undefined,
    };
  });

  private readonly _syncUrl = effect(() => {
    const params = this.queryParams();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });

  // Build a stream that re-queries the API on changes
  private readonly pets$ = combineLatest([
    toObservable(this.sortBy),
    toObservable(this.sortOrder),
    toObservable(this.page),
    toObservable(this.limit),
    toObservable(this.kindFilter),
  ]).pipe(
    switchMap(([sort, order, page, limit, kind]) => {
      // When "kind" is chosen as the criterion, use API filtering (kind=dog|cat)
      // and do not send _sort/_order
      if (sort === 'kind') {
        return this.api.getPets({
          page,
          limit,
          kind: kind || undefined,
        });
      }

      // Otherwise, sort normally with _sort and _order
      return this.api.getPets({
        sort,
        order,
        page,
        limit,
      });
    }),
    map(items => items ?? []),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // Signal for template consumption
  readonly pets = toSignal<Pet[] | undefined>(this.pets$);

  readonly total = computed(() => this.pets()?.length ?? 0);

  // Prev/Next enablement
  readonly canPrev = computed(() => this.page() > 1);
  readonly canNext = computed(() => (this.pets()?.length ?? 0) >= this.limit());

  onChangeSortBy(value: string) {
    const next = value as SortKey;
    this.sortBy.set(next);

    // If switching to "kind", reset kind filter (All) and hide order in template
    if (next === 'kind') {
      this.kindFilter.set('');
    }
  }

  onChangeSortOrder(value: string) {
    this.sortOrder.set(value as SortOrder);
  }

  onChangeKindFilter(value: string) {
    // '' = All, or 'dog' | 'cat'
    this.kindFilter.set((value as '' | 'dog' | 'cat'));
    this.page.set(1); // reset to first page on filter change
  }

  onChangeLimit(value: string) {
    const size = Number(value) || 12;
    this.limit.set(size);
    this.page.set(1); // reset to first page on page-size change
  }

  onPrevPage() {
    if (this.canPrev()) this.page.update(p => Math.max(1, p - 1));
  }

  onNextPage() {
    if (this.canNext()) this.page.update(p => p + 1);
  }

  onPetOfTheDay(): void {
    // Fetch ALL pets ignoring current filters/sorting/pagination
    this.api.getPets({}).pipe(take(1)).subscribe((all) => {
      const ids = (all ?? [])
        .map((p) => p?.id)
        .filter((x): x is number => Number.isFinite(x))
        .sort((a, b) => a - b);

      if (ids.length === 0) return;

      // Deterministic UTC date key (YYYY-MM-DD)
      const todayUTC = new Date();
      const yyyy = todayUTC.getUTCFullYear();
      const mm = String(todayUTC.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(todayUTC.getUTCDate()).padStart(2, '0');
      const dateKey = `${yyyy}-${mm}-${dd}`;

      // Hash dateKey to a non-negative integer and map to index
      const idx = this.hashString(dateKey) % ids.length;
      const targetId = ids[idx] ?? ids[0];

      const params = typeof this.queryParams === 'function' ? this.queryParams() : undefined;

      // Navigate directly to the selected ID. The detail page fetches by ID,
      // so it works even if the current list has filters (e.g., showing only cats)
      this.router.navigate(['/pets', targetId], {
        queryParams: params,
        queryParamsHandling: 'merge',
      });
    });
  }

  private hashString(input: string): number {
    let h = 0x811c9dc5; // FNV-1a 32-bit offset basis
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 0x01000193); // FNV prime
      h >>>= 0; // keep as unsigned 32-bit
    }
    return h;
  }
}
