import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPedidos } from './detail-pedidos';

describe('DetailPedidos', () => {
  let component: DetailPedidos;
  let fixture: ComponentFixture<DetailPedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPedidos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPedidos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
