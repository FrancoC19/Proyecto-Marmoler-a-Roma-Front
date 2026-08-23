import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPiletas } from './formulario-piletas';

describe('FormularioPiletas', () => {
  let component: FormularioPiletas;
  let fixture: ComponentFixture<FormularioPiletas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPiletas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioPiletas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
