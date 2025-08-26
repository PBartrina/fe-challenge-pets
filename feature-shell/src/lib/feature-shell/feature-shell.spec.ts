import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureShell } from './feature-shell';

describe('FeatureShell', () => {
  let component: FeatureShell;
  let fixture: ComponentFixture<FeatureShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureShell],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
