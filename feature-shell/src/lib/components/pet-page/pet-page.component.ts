import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Pet, PetsService } from 'data-access-pets';
import { PetCardComponent } from 'ui';
import { combineLatest, map, shareReplay, switchMap } from 'rxjs';

type SortKey = 'weight' | 'length' | 'height' | 'name' | 'kind';
type SortOrder = 'asc' | 'desc';

@Component({
  selector: 'feature-pet-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pet-page.component.html',
  styleUrl: './pet-page.component.scss',
  imports: [PetCardComponent]
})
export class PetsPageComponent {
  private readonly api = inject(PetsService);

  // Sorting state
  readonly sortBy = signal<SortKey>('name');
  readonly sortOrder = signal<SortOrder>('asc');

  // Kind filter used when sortBy === 'kind'
  readonly kindFilter = signal<'' | 'dog' | 'cat'>('');

  // Pagination state
  readonly page = signal(1);       // 1-based for JSON Server
  readonly limit = signal(12);     // items per page

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
}
