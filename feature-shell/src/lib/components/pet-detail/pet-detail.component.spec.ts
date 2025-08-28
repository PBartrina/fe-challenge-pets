import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetDetailComponent } from './pet-detail.component';
import { PetsService, Pet } from 'data-access-pets';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('PetDetailComponent', () => {
  let fixture: ComponentFixture<PetDetailComponent>;
  let component: PetDetailComponent;

  beforeEach(async () => {
    // Prepare a default Pet for the mocked service to return at construction time
    const pet: Pet = {
      id: 42,
      name: 'Answer',
      kind: 'dog',
      weight: 10,
      height: 20,
      length: 30,
      photo_url: 'https://example.test/pet.jpg',
      description: 'A very good dog',
    } as Pet;

    await TestBed.configureTestingModule({
      imports: [PetDetailComponent],
      providers: [
        // Provide a mock that already returns an observable before component instantiation
        {
          provide: PetsService,
          useFactory: () => ({
            getPetById: jest.fn().mockReturnValue(of(pet)),
          }),
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '42' : null),
              },
              queryParams: { sort: 'name', order: 'asc' },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('calls service with route id and exposes pet signal', () => {
    const value = component.pet();
    expect(value).toBeTruthy();
    expect(value?.id).toBe(42);
    expect(value?.name).toBe('Answer');
  });

  it('exposes backQuery from route query params', () => {
    expect(component.backQuery()).toEqual({ sort: 'name', order: 'asc' });
  });
});