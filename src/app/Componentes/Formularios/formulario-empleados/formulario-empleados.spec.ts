import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEmpleados } from './formulario-empleados';

describe('FormularioEmpleados', () => {
  let component: FormularioEmpleados;
  let fixture: ComponentFixture<FormularioEmpleados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioEmpleados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioEmpleados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
