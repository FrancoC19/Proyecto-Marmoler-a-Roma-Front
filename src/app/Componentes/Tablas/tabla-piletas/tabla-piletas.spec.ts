import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPiletas } from './tabla-piletas';

describe('TablaPiletas', () => {
  let component: TablaPiletas;
  let fixture: ComponentFixture<TablaPiletas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaPiletas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaPiletas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
