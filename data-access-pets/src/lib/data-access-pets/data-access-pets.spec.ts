import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataAccessPets } from './data-access-pets';

describe('DataAccessPets', () => {
  let component: DataAccessPets;
  let fixture: ComponentFixture<DataAccessPets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataAccessPets],
    }).compileComponents();

    fixture = TestBed.createComponent(DataAccessPets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
