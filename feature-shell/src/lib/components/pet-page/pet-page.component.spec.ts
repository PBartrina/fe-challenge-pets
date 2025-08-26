// feature-shell/src/lib/components/pet-page/pet-page.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { PetsPageComponent } from './pet-page.component';
import { PetsService, Pet } from 'data-access-pets';

class PetsServiceStub {
  lastQuery: any;
  private resp$ = new Subject<Pet[]>();

  getPets(query: any) {
    this.lastQuery = query;
    return this.resp$.asObservable();
  }

  emit(items: Pet[]) {
    this.resp$.next(items);
  }
}

describe('PetsPageComponent', () => {
  let fixture: ComponentFixture<PetsPageComponent>;
  let component: PetsPageComponent;
  let api: PetsServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsPageComponent],
      providers: [{ provide: PetsService, useClass: PetsServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(PetsPageComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(PetsService) as unknown as PetsServiceStub;
    fixture.detectChanges();
  });

  it('shows "Order" selector by default and hides "Kind"', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Order');
    expect(text).not.toContain('Kind');
  });

  it('switches to Kind filter when sortBy = kind and hides Order', () => {
    component.onChangeSortBy('kind');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Kind');
    expect(text).not.toContain('Order');
  });

  it('calls service with _sort/_order when sort by numeric/text fields', () => {
    component.onChangeSortBy('weight');
    component.onChangeSortOrder('asc');
    fixture.detectChanges();

    // trigger stream by emitting once
    api.emit([] as Pet[]);
    expect(api.lastQuery).toEqual(
      jasmine.objectContaining({ sort: 'weight', order: 'asc', page: 1, limit: 12 })
    );
  });

  it('calls service with kind filter (no _sort/_order) when sortBy=kind', () => {
    component.onChangeSortBy('kind');
    component.onChangeKindFilter('dog');
    fixture.detectChanges();

    api.emit([] as Pet[]);
    expect(api.lastQuery).toEqual(
      jasmine.objectContaining({ kind: 'dog', page: 1, limit: 12 })
    );
    expect(api.lastQuery.sort).toBeUndefined();
    expect(api.lastQuery.order).toBeUndefined();
  });

  it('updates pagination on next/prev respecting bounds', () => {
    // default page=1, limit=12
    component.onNextPage();
    api.emit([] as Pet[]);
    expect(api.lastQuery.page).toBe(2);

    component.onPrevPage();
    api.emit([] as Pet[]);
    expect(api.lastQuery.page).toBe(1);

    component.onPrevPage(); // should stay at 1
    api.emit([] as Pet[]);
    expect(api.lastQuery.page).toBe(1);
  });

  it('resets to page 1 when page size changes', () => {
    component.onNextPage(); // page 2
    api.emit([] as Pet[]);
    expect(api.lastQuery.page).toBe(2);

    component.onChangeLimit('24');
    api.emit([] as Pet[]);
    expect(api.lastQuery.page).toBe(1);
    expect(api.lastQuery.limit).toBe(24);
  });
});
