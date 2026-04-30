import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPedidosFinalizados } from './detail-pedidos-finalizados';

describe('DetailPedidosFinalizados', () => {
  let component: DetailPedidosFinalizados;
  let fixture: ComponentFixture<DetailPedidosFinalizados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPedidosFinalizados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPedidosFinalizados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
