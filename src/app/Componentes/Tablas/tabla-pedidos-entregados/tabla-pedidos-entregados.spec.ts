import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPedidosEntregados } from './tabla-pedidos-entregados';

describe('TablaPedidosEntregados', () => {
  let component: TablaPedidosEntregados;
  let fixture: ComponentFixture<TablaPedidosEntregados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaPedidosEntregados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaPedidosEntregados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
