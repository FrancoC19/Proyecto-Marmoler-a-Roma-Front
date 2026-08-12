import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPedidos } from './formulario-pedidos';

describe('FormularioPedidos', () => {
  let component: FormularioPedidos;
  let fixture: ComponentFixture<FormularioPedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPedidos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioPedidos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
