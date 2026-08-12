import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaMateriales } from './tabla-materiales';

describe('TablaMateriales', () => {
  let component: TablaMateriales;
  let fixture: ComponentFixture<TablaMateriales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaMateriales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaMateriales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
