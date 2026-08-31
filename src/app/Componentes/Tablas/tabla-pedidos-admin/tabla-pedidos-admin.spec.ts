import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPedidosAdmin } from './tabla-pedidos-admin';

describe('TablaPedidosAdmin', () => {
  let component: TablaPedidosAdmin;
  let fixture: ComponentFixture<TablaPedidosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaPedidosAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaPedidosAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
