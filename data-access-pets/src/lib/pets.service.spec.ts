// data-access-pets/src/lib/pets.service.spec.ts
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PETS_API_BASE_URL } from './pets.tokens';
import { PetsService } from './pets.service';
import { Pet } from './models/pet.model';

describe('PetsService', () => {
  let service: PetsService;
  let httpMock: HttpTestingController;

  const baseUrl = 'https://example.test/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: PETS_API_BASE_URL, useValue: baseUrl }],
    });

    service = TestBed.inject(PetsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should request with sort/order/page/limit params', () => {
    service.getPets({ sort: 'weight', order: 'desc', page: 2, limit: 12 }).subscribe();

    const req = httpMock.expectOne(
      (r) =>
        r.method === 'GET' &&
        r.url === `${baseUrl}/pets` &&
        r.params.get('_sort') === 'weight' &&
        r.params.get('_order') === 'desc' &&
        r.params.get('_page') === '2' &&
        r.params.get('_limit') === '12'
    );
    req.flush([] satisfies Pet[]);
  });

  it('should request with kind filter when provided', () => {
    service.getPets({ kind: 'dog', page: 1, limit: 6 }).subscribe();

    const req = httpMock.expectOne(
      (r) =>
        r.method === 'GET' &&
        r.url === `${baseUrl}/pets` &&
        r.params.get('kind') === 'dog' &&
        r.params.get('_page') === '1' &&
        r.params.get('_limit') === '6'
    );
    req.flush([] satisfies Pet[]);
  });
});