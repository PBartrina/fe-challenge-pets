import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pet } from './models/pet.model';
import { Observable } from 'rxjs';
import { PETS_API_BASE_URL } from './pets.tokens';

export type SortKey = 'weight' | 'length' | 'height' | 'name' | 'kind';
export type SortOrder = 'asc' | 'desc';

export interface PetsQuery {
  sort?: SortKey;     // maps to _sort
  order?: SortOrder;   // => _order
  // pagination
  page?: number;       // => _page (1-based)
  limit?: number;      // => _limit
  // filters
  kind?: 'dog' | 'cat'; // => kind=dog|cat
}

@Injectable({ providedIn: 'root' })
export class PetsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(PETS_API_BASE_URL);

  getPets(query: PetsQuery = {}): Observable<Pet[]> {
    let params = new HttpParams();

    if (query.sort)  params = params.set('_sort', query.sort);
    if (query.order) params = params.set('_order', query.order);

    // pagination
    if (typeof query.page === 'number')  params = params.set('_page', String(query.page));
    if (typeof query.limit === 'number') params = params.set('_limit', String(query.limit));

    // filters
    if (query.kind) params = params.set('kind', query.kind);

    return this.http.get<Pet[]>(`${this.baseUrl}/pets`, { params });
  }

  getPetById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.baseUrl}/pets/${id}`);
  }
}
